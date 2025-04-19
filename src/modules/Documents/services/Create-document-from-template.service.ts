import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Document,
  DocumentCategory,
  DocumentStatus,
  DocumentType,
} from '../entities/document.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { CreateFormResponseService } from '@modules/formResponses/services/create.formResponse.service';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeneratePdfService } from './generate-pdf.service';
import { DocumentVerificationService } from './document-verification.service';

interface CreateDocumentFromTemplateDto {
  form_template_id: string;
  created_by: string;
}

@Injectable()
export class CreateDocumentFromTemplateService {
  private readonly logger = new Logger(CreateDocumentFromTemplateService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
    private createFormResponseService: CreateFormResponseService,
    private generatePdfService: GeneratePdfService,
    private documentVerificationService: DocumentVerificationService,
  ) {}

  async execute(data: CreateDocumentFromTemplateDto): Promise<Document> {
    this.logger.log(
      `Criando documento a partir do template: ${data.form_template_id}`,
    );

    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: data.created_by },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    // Verificar se o template existe
    const formTemplate = await this.formTemplateRepository.findOne({
      where: { id: data.form_template_id },
    });

    if (!formTemplate) {
      throw new HttpException('Template de formulário não encontrado', 404);
    }

    try {
      const formResponse = await this.createFormResponseService.execute({
        templateId: formTemplate.mongoTemplateId,
        createdBy: data.created_by,
      });

      const content = this.extractContentFromTemplate(formResponse);

      this.logger.log(`Conteúdo extraído: ${content.substring(0, 200)}...`);

      // Gerar código de verificação para o documento
      const verificationCode = this.documentVerificationService.generateVerificationCode();

      const document = this.documentRepository.create({
        name: `Documento baseado em ${formTemplate.name}`,
        description: formTemplate.description || '',
        content: content,
        type: DocumentType.FORM_BASED,
        category: DocumentCategory.OTHER,
        status: DocumentStatus.DRAFT,
        next_action: 'Editar',
        form_template_id: formTemplate.id,
        form_response_id: formResponse._id.toString(),
        is_signature_required: false,
        created_by: data.created_by,
        verification_code: verificationCode,
      });

      const savedDocument = await this.documentRepository.save(document);

      await this.generatePdfService.execute(document.id, data.created_by);
      this.logger.log(`Documento criado com sucesso: ${savedDocument.id}`);

      return savedDocument;
    } catch (error) {
      this.logger.error(
        `Erro ao criar documento: ${error.message}`,
        error.stack,
      );
      throw new HttpException(`Erro ao criar documento: ${error.message}`, 400);
    }
  }

  private extractContentFromTemplate(formResponse: any): string {
    if (formResponse.sessions && formResponse.sessions.length > 0) {
      for (const session of formResponse.sessions) {
        if (session.fields && session.fields.length > 0) {
          const documentTemplateFields = session.fields.filter(
            (field) => field.type === 'document_template',
          );

          for (const field of documentTemplateFields) {
            if (field.content) return field.content;
          }

          const contentFields = session.fields.filter(
            (field) =>
              field.type === 'rich_text_display' ||
              field.type === 'rich_text_input' ||
              field.type === 'text' ||
              field.type === 'textarea',
          );

          for (const field of contentFields) {
            if (field.content) return field.content;
            if (field.description) return field.description;
            if (field.response) return field.response;
          }
        }
      }
    }

    return '';
  }
}
