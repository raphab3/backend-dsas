import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Document,
  DocumentStatus,
  DocumentType,
} from '../entities/document.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { CombineDocumentsDto } from '../dto/combine-Document.dto';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { DocumentVerificationService } from './document-verification.service';

@Injectable()
export class CombineDocumentsService {
  private readonly logger = new Logger(CombineDocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
    private documentVerificationService: DocumentVerificationService,
  ) {}

  async execute(combineDocumentsDto: CombineDocumentsDto) {
    this.logger.log(
      `Combinando documentos: ${combineDocumentsDto.document_ids.join(', ')}`,
    );

    // Verificar se é uma combinação ou apenas aplicação de header/footer
    const isHeaderFooterOnly =
      combineDocumentsDto.document_ids.length === 1 &&
      (combineDocumentsDto.header_template_id ||
        combineDocumentsDto.footer_template_id);

    if (
      combineDocumentsDto.document_ids.length < 1 ||
      (!isHeaderFooterOnly && combineDocumentsDto.document_ids.length < 2)
    ) {
      throw new HttpException(
        'São necessários pelo menos dois documentos para combinar ou um documento com header/footer',
        400,
      );
    }

    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: combineDocumentsDto.created_by },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    // Buscar todos os documentos a serem combinados
    const documents = await this.documentRepository.findBy({
      id: In(combineDocumentsDto.document_ids),
    });

    if (documents.length !== combineDocumentsDto.document_ids.length) {
      throw new HttpException('Um ou mais documentos não encontrados', 404);
    }

    // Verificar se todos os documentos estão em um status que permite combinação
    const invalidDocuments = documents.filter(
      (doc) => doc.status === DocumentStatus.ARCHIVED,
    );

    if (invalidDocuments.length > 0) {
      throw new HttpException(
        'Documentos arquivados não podem ser combinados',
        400,
      );
    }

    try {
      // Extrair conteúdo de header/footer se especificados
      let headerContent = null;
      let footerContent = null;

      if (combineDocumentsDto.header_template_id) {
        headerContent = await this.extractTemplateContent(
          combineDocumentsDto.header_template_id,
        );
      }

      if (combineDocumentsDto.footer_template_id) {
        footerContent = await this.extractTemplateContent(
          combineDocumentsDto.footer_template_id,
        );
      }

      // Combinar conteúdo dos documentos
      let combinedContent = '';

      // Adicionar cabeçalho se especificado
      if (headerContent) {
        combinedContent += `<div class="document-header">${headerContent}</div>`;
      }

      // Ordenar documentos na ordem especificada na requisição
      const sortedDocuments = [...documents].sort(
        (a, b) =>
          combineDocumentsDto.document_ids.indexOf(a.id) -
          combineDocumentsDto.document_ids.indexOf(b.id),
      );

      // Gerar sumário automático se solicitado
      if (combineDocumentsDto.add_table_of_contents) {
        combinedContent += '<div class="table-of-contents">';
        combinedContent += '<h2>Sumário</h2>';
        combinedContent += '<ul>';

        sortedDocuments.forEach((doc, index) => {
          combinedContent += `<li><a href="#doc-${index + 1}">${doc.name}</a></li>`;
        });

        combinedContent += '</ul>';
        combinedContent += '</div>';
        combinedContent += '<hr style="page-break-after: always;">\n';
      }

      // Adicionar conteúdo de cada documento
      for (let i = 0; i < sortedDocuments.length; i++) {
        const doc = sortedDocuments[i];

        // Adicionar separador entre documentos, exceto para o primeiro
        if (i > 0 && combineDocumentsDto.add_separators) {
          combinedContent += '<hr style="page-break-after: always;">\n';
        }

        // Adicionar âncora para o sumário
        combinedContent += `<div id="doc-${i + 1}" class="document-content">`;

        // Adicionar título do documento

        // Adicionar conteúdo do documento
        combinedContent += doc.content || '';

        combinedContent += '</div>';
      }

      // Adicionar rodapé se especificado
      if (footerContent) {
        combinedContent += `<div class="document-footer">${footerContent}</div>`;
      }

      // Gerar código de verificação para o documento
      const verificationCode = this.documentVerificationService.generateVerificationCode();

      // Criar novo documento combinado
      const combinedDocument = this.documentRepository.create({
        name: combineDocumentsDto.name,
        description:
          combineDocumentsDto.description ||
          `Combinação de ${documents.length} documentos`,
        type: DocumentType.COMBINED,
        status: DocumentStatus.DRAFT,
        next_action: 'Editar',
        content: combinedContent,
        header_template_id: combineDocumentsDto.header_template_id || null,
        footer_template_id: combineDocumentsDto.footer_template_id || null,
        parent_document_ids: combineDocumentsDto.document_ids,
        created_by: combineDocumentsDto.created_by,
        verification_code: verificationCode,
      });

      const savedDocument =
        await this.documentRepository.save(combinedDocument);

      this.logger.log(`Documentos combinados com sucesso: ${savedDocument.id}`);
      return {
        id: savedDocument.id,
        name: savedDocument.name,
        message: isHeaderFooterOnly
          ? `Documento criado com cabeçalho/rodapé aplicado`
          : `${documents.length} documentos combinados com sucesso`,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao combinar documentos: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Erro ao combinar documentos: ${error.message}`,
        400,
      );
    }
  }

  /**
   * Extrai o conteúdo HTML de um template (cabeçalho/rodapé)
   */
  private async extractTemplateContent(
    templateId: string,
  ): Promise<string | null> {
    try {
      // Primeiro, buscar o formTemplate no PostgreSQL para obter o MongoDB ID
      const formTemplate = await this.formTemplateRepository.findOne({
        where: { id: templateId },
      });

      if (!formTemplate) {
        this.logger.warn(`Template ${templateId} não encontrado`);
        return null;
      }

      // Buscar os detalhes do template no MongoDB
      const mongoTemplate = await this.formTemplateMongoModel.findById(
        formTemplate.mongoTemplateId,
      );

      if (!mongoTemplate) {
        this.logger.warn(
          `Documento MongoDB para template ${templateId} não encontrado`,
        );
        return null;
      }

      // Procurar o conteúdo relevante no template
      const content = '';

      // Iterar pelas sessões e campos do template
      if (mongoTemplate.sessions && mongoTemplate.sessions.length > 0) {
        for (const session of mongoTemplate.sessions) {
          if (session.fields && session.fields.length > 0) {
            // Primeiro, procurar por campos específicos de template de documento
            const documentTemplateFields = session.fields.filter(
              (field) => field.type === 'document_template',
            );

            for (const field of documentTemplateFields) {
              if (field.content) {
                return field.content;
              }
            }

            // Se não encontrar, buscar em outros tipos de campo que possam conter o conteúdo
            const contentFields = session.fields.filter(
              (field) =>
                field.type === 'rich_text_display' ||
                field.type === 'rich_text_input',
            );

            for (const field of contentFields) {
              if (field.content) {
                return field.content;
              }
            }
          }
        }
      }

      return content || '<p>Template sem conteúdo</p>';
    } catch (error) {
      this.logger.error(
        `Erro ao extrair conteúdo do template ${templateId}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }
}
