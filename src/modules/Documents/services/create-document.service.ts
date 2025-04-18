import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Document,
  DocumentCategory,
  DocumentStatus,
  DocumentType,
} from '../entities/document.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '@modules/formResponses/schemas/form_response.schema';
import { CreateDocumentDto } from '../dto/create-Document.dto';
import { GeneratePdfService } from './generate-pdf.service';

@Injectable()
export class CreateDocumentService {
  private readonly logger = new Logger(CreateDocumentService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
    private generatePdfService: GeneratePdfService,
  ) {}

  async execute(createDocumentDto: CreateDocumentDto): Promise<Document> {
    this.logger.log(
      `Iniciando criação de documento: ${createDocumentDto.name}`,
    );

    if (!createDocumentDto.created_by) {
      throw new HttpException('Usuário não informado', 400);
    }

    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: createDocumentDto.created_by },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    // Se form_template_id for fornecido, verificar se existe
    let formTemplate: FormTemplate | null = null;
    let formTemplateMongo: FormTemplateMongoDocument | null = null;

    if (createDocumentDto.form_template_id) {
      formTemplate = await this.formTemplateRepository.findOne({
        where: { id: createDocumentDto.form_template_id },
      });

      if (!formTemplate) {
        throw new HttpException('Template de formulário não encontrado', 404);
      }

      // Buscar documento do MongoDB
      formTemplateMongo = await this.formTemplateMongoModel.findById(
        formTemplate.mongoTemplateId,
      );

      if (!formTemplateMongo) {
        throw new HttpException(
          'Template de formulário (MongoDB) não encontrado',
          404,
        );
      }
    }

    // Se form_response_id for fornecido, verificar se existe
    if (createDocumentDto.form_response_id) {
      const formResponse = await this.formResponseModel.findById(
        createDocumentDto.form_response_id,
      );

      if (!formResponse) {
        throw new HttpException('Resposta de formulário não encontrada', 404);
      }
    }

    try {
      const document = this.documentRepository.create({
        name: createDocumentDto.name,
        description: createDocumentDto.description,
        type: DocumentType.FORM_BASED,
        category: createDocumentDto.category || DocumentCategory.OTHER,
        status: DocumentStatus.DRAFT,
        next_action: 'Editar',
        content: createDocumentDto.content,
        form_template_id: createDocumentDto.form_template_id,
        form_response_id: createDocumentDto.form_response_id,
        header_template_id: createDocumentDto.header_template_id,
        footer_template_id: createDocumentDto.footer_template_id,
        is_signature_required: createDocumentDto.is_signature_required || false,
        created_by: createDocumentDto.created_by,
      });

      const savedDocument = await this.documentRepository.save(document);
      this.logger.log(`Documento criado com sucesso: ${savedDocument.id}`);

      await this.generatePdfService.execute(
        savedDocument.id,
        createDocumentDto.created_by,
      );

      return savedDocument;
    } catch (error) {
      this.logger.error(
        `Erro ao criar documento: ${error.message}`,
        error.stack,
      );
      throw new HttpException(`Erro ao criar documento: ${error.message}`, 400);
    }
  }
}
