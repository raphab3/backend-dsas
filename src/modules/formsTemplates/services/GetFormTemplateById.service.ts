import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormTemplate } from '../entities/forms_template.entity';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '../schemas/forms_template.schema';

@Injectable()
export class GetFormTemplateByIdService {
  private readonly logger = new Logger(GetFormTemplateByIdService.name);

  constructor(
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
  ) {}

  async execute(id: string) {
    try {
      // Buscar o template no PostgreSQL
      const pgTemplate = await this.formTemplateRepository.findOne({
        where: { id },
      });

      if (!pgTemplate) {
        throw new NotFoundException(`FormTemplate with id ${id} not found`);
      }

      // Buscar os detalhes adicionais no MongoDB
      const mongoTemplate = await this.formTemplateMongoModel.findById(
        pgTemplate.mongoTemplateId,
      );

      if (!mongoTemplate) {
        throw new NotFoundException(
          `MongoDB document for FormTemplate ${id} not found`,
        );
      }

      const combinedTemplate = {
        ...pgTemplate,
        sessions: mongoTemplate.sessions,
        metadata: mongoTemplate.metadata,
        rules: mongoTemplate.rules,
        tags: mongoTemplate.tags,
      };

      return combinedTemplate;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve FormTemplate: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
