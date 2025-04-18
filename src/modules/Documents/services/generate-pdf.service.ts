import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormTemplateMongoDocument,
  FormTemplateMongo,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import puppeteer from 'puppeteer';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '@modules/formResponses/schemas/form_response.schema';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { DocumentVersion } from '../entities/documentVersion.entity';
import { SignatureRequirementStatus } from '../entities/signatureRequirement.entity';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Injectable()
export class GeneratePdfService {
  private readonly logger = new Logger(GeneratePdfService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(DocumentVersion)
    private documentVersionRepository: Repository<DocumentVersion>,
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
    private s3Provider: S3Provider,
  ) {}

  async execute(documentId: string, userId: string) {
    this.logger.log(`Gerando PDF para documento ${documentId}`);

    try {
      // Buscar documento com relacionamentos
      const document = await this.documentRepository.findOne({
        where: { id: documentId },
        relations: [
          'signatures',
          'signatures.user',
          'signatures.user.person_sig',
          'form_template',
          'versions',
        ],
      });

      if (!document) {
        throw new HttpException('Documento não encontrado', 404);
      }

      // Obter a versão atual mais alta para criar a próxima
      const latestVersion = await this.documentVersionRepository.findOne({
        where: {
          document: {
            id: documentId,
          },
        },
        order: { version: 'DESC' },
      });

      const newVersion = latestVersion ? latestVersion.version + 1 : 1;

      // Para documentos já carregados (tipo UPLOADED), usar o arquivo original se disponível
      if (document.type === 'UPLOADED' && latestVersion) {
        this.logger.log(
          `Documento é do tipo UPLOADED. Usando arquivo original para versão ${newVersion}`,
        );

        // Copiar o arquivo original para a nova localização de versão
        const originalS3Location = latestVersion.s3_location;
        const newS3Key = `documents/${document.id}/pdf/${newVersion}.pdf`;

        await this.s3Provider.copyObject(originalS3Location, newS3Key);

        // Criar versão do documento
        const documentVersion = this.documentVersionRepository.create({
          document: {
            id: document.id,
          },
          version: newVersion,
          s3_location: newS3Key,
          mime_type: latestVersion.mime_type,
          change_reason: 'Cópia de arquivo original',
          created_by: userId,
        });

        await this.documentVersionRepository.save(documentVersion);

        // Gerar URL de download
        const downloadUrl = await this.s3Provider.getSignedUrl(newS3Key, 3600);

        return {
          document_id: document.id,
          version: documentVersion.version,
          download_url: downloadUrl,
        };
      }

      // Preparar dados para o PDF
      let formResponseData = null;

      // Se baseado em um FormResponse, buscar dados
      if (document.form_response_id) {
        const formResponse = await this.formResponseModel
          .findById(document.form_response_id)
          .lean();

        if (!formResponse) {
          throw new HttpException('Resposta de formulário não encontrada', 404);
        }

        formResponseData = formResponse;
      }

      // Obter headers e footers se necessário
      let headerContent = '';
      let footerContent = '';

      if (document.header_template_id) {
        try {
          headerContent = await this.getTemplateContent(
            document.header_template_id,
          );
        } catch (error) {
          this.logger.warn(`Erro ao buscar header template: ${error.message}`);
        }
      }

      if (document.footer_template_id) {
        try {
          footerContent = await this.getTemplateContent(
            document.footer_template_id,
          );
        } catch (error) {
          this.logger.warn(`Erro ao buscar footer template: ${error.message}`);
        }
      }

      // Gerar PDF
      const pdfBuffer = await this.generatePdf(
        document,
        formResponseData,
        headerContent,
        footerContent,
      );

      // Salvar PDF no S3
      const s3Key = `documents/${document.id}/pdf/${Date.now()}.pdf`;
      await this.s3Provider.uploadContent(pdfBuffer, s3Key, {
        contentType: 'application/pdf',
        contentDisposition: 'inline',
        metadata: {
          documentId: document.id,
          userId: userId,
          generatedAt: new Date().toISOString(),
        },
      });

      // Criar versão do documento
      const documentVersion = this.documentVersionRepository.create({
        document: {
          id: document.id,
        },
        version: newVersion,
        s3_location: s3Key,
        mime_type: 'application/pdf',
        change_reason: 'Geração de PDF',
        created_by: userId,
      });

      await this.documentVersionRepository.save(documentVersion);

      // Gerar URL de download
      const downloadUrl = await this.s3Provider.getSignedUrl(s3Key, 3600);

      return {
        document_id: document.id,
        version: documentVersion.version,
        download_url: downloadUrl,
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar PDF: ${error.message}`, error.stack);
      throw new HttpException(`Erro ao gerar PDF: ${error.message}`, 400);
    }
  }

  /**
   * Obtém o conteúdo de um template
   */
  private async getTemplateContent(templateId: string): Promise<string> {
    const formTemplate = await this.formTemplateMongoModel
      .findById(templateId)
      .lean();

    if (!formTemplate) {
      throw new Error(`Template ${templateId} não encontrado`);
    }

    return this.extractContentFromFormTemplate(formTemplate);
  }

  /**
   * Extrai conteúdo de um template de formulário
   */
  private extractContentFromFormTemplate(formTemplate: any): string {
    if (!formTemplate.sessions || formTemplate.sessions.length === 0) {
      return '';
    }

    // Tenta encontrar um campo com tipo 'rich_text_display' ou similar
    for (const session of formTemplate.sessions) {
      if (!session.fields || session.fields.length === 0) continue;

      for (const field of session.fields) {
        if (
          field.type === 'rich_text_display' ||
          field.type === 'document_template' ||
          field.type === 'rich_text_input'
        ) {
          return field.content || '';
        }
      }
    }

    return '';
  }

  private async generatePdf(
    document: Document,
    formData: any,
    header: string = '',
    footer: string = '',
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Preparar as áreas de assinatura para o documento
    let signaturesHtml = '';
    if (document.signatures && document.signatures.length > 0) {
      signaturesHtml = `
        <div style="margin-top: 30px; page-break-inside: avoid;">
          <h3 style="text-align: center; margin-bottom: 20px;">Assinaturas</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      document.signatures.forEach((signature) => {
        const isCompleted =
          signature.status === SignatureRequirementStatus.SIGNED;

        // Determinar o estilo com base no status da assinatura
        const boxStyle = isCompleted
          ? `
        border: 2px solid #4CAF50;
        background-color: rgba(76, 175, 80, 0.1);
      `
          : `
        border: 2px dashed #999;
        background-color: rgba(249, 249, 249, 0.5);
      `;

        const statusText = isCompleted
          ? `<div style="color: #4CAF50; font-weight: bold;">Assinado em ${
              signature.completed_at
                ? format(
                    new Date(signature.completed_at),
                    'dd/MMM/yyyy HH:mm',
                    { locale: ptBR },
                  )
                : 'data não disponível'
            }</div>`
          : '<div style="color: #f39c12; font-weight: bold;">Pendente</div>';

        signaturesHtml += `
          <div style="
            padding: 10px;
            border-radius: 4px;
            ${boxStyle}
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: bold;">${signature.user?.person_sig?.nome || 'Signatário'}</div>
                <div style="color: #666; font-size: 0.9em;">${signature.role || 'Assinatura'}</div>
              </div>
              ${statusText}
            </div>
            ${
              signature.status === SignatureRequirementStatus.SIGNED
                ? '<div style="margin-top: 10px; height: 30px; border-bottom: 1px solid #4CAF50;"></div>'
                : '<div style="margin-top: 10px; height: 30px; border-bottom: 1px dashed #999;"></div>'
            }
          </div>
        `;
      });

      signaturesHtml += `
          </div>
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${document.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
          }
          .document-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
          }
          .document-info {
            font-size: 12px;
            color: #666;
            text-align: right;
            margin-bottom: 20px;
          }
          .ql-align-center { text-align: center; }
          .ql-align-right { text-align: right; }
          .ql-align-justify { text-align: justify; }
          
          /* Estilos para preservar formatação do ReactQuill */
          strong { font-weight: bold; }
          em { font-style: italic; }
          u { text-decoration: underline; }
          s { text-decoration: line-through; }
          ol, ul { padding-left: 20px; }
          
          /* Estilos para áreas de assinatura */
          .signature-area {
            border: 2px dashed #333;
            padding: 20px 10px;
            margin: 10px 0;
            text-align: center;
            background-color: rgba(240, 240, 240, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="header">${header}</div>
        
        <div class="document-info">
          Documento #${document.id}<br>
          Gerado em: ${format(new Date(), 'dd/MMM/yyyy HH:mm', {
            locale: ptBR,
          })}
        </div>
        
        <div class="document-content">${document.content || ''}</div>
        
        ${signaturesHtml}
        
        <div class="footer">${footer}</div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);

    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', right: '20px', bottom: '40px', left: '20px' },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
