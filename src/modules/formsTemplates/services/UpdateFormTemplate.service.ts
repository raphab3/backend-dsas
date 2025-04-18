import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormTemplate } from '../entities/forms_template.entity';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '../schemas/forms_template.schema';
import { UpdateFormTemplateDto } from '../dto/form-template.dto';

@Injectable()
export class UpdateFormTemplateService {
  private readonly logger = new Logger(UpdateFormTemplateService.name);

  constructor(
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
  ) {}

  async execute(id: string, updateFormTemplateDto: UpdateFormTemplateDto) {
    console.log('updateFormTemplateDto:', updateFormTemplateDto);
    const queryRunner =
      this.formTemplateRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar o template no PostgreSQL
      const pgTemplate = await this.formTemplateRepository.findOne({
        where: { id },
      });

      if (!pgTemplate) {
        throw new NotFoundException('FormTemplate not found');
      }

      // Atualizar campos básicos no PostgreSQL
      pgTemplate.name = updateFormTemplateDto.name ?? pgTemplate.name;
      pgTemplate.description =
        updateFormTemplateDto.description ?? pgTemplate.description;
      pgTemplate.category =
        updateFormTemplateDto.category ?? pgTemplate.category;
      pgTemplate.type = updateFormTemplateDto.type ?? pgTemplate.type;
      pgTemplate.isPublished =
        updateFormTemplateDto.isPublished ?? pgTemplate.isPublished;
      pgTemplate.is_global =
        updateFormTemplateDto.is_global ?? pgTemplate.is_global;
      pgTemplate.location_id = pgTemplate.is_global
        ? null
        : (updateFormTemplateDto.location_id ?? pgTemplate.location_id);

      // Buscar e atualizar o documento no MongoDB
      const mongoTemplate = await this.formTemplateMongoModel.findById(
        pgTemplate.mongoTemplateId,
      );

      if (!mongoTemplate) {
        throw new NotFoundException('MongoDB documento não encontrado');
      }

      // Atualizar campos no MongoDB
      mongoTemplate.name = updateFormTemplateDto.name ?? mongoTemplate.name;
      mongoTemplate.description =
        updateFormTemplateDto.description ?? mongoTemplate.description;

      if (updateFormTemplateDto.sessions) {
        mongoTemplate.sessions = updateFormTemplateDto.sessions.map(
          (session) => ({
            ...session,
            _id: session._id
              ? new Types.ObjectId(session._id)
              : new Types.ObjectId(),
            fields: session.fields.map((field) => ({
              ...field,
              _id: field._id
                ? new Types.ObjectId(field._id)
                : new Types.ObjectId(),
            })),
          }),
        );
      }

      if (updateFormTemplateDto.metadata) {
        mongoTemplate.metadata = updateFormTemplateDto.metadata;
      }

      if (updateFormTemplateDto.rules) {
        mongoTemplate.rules = updateFormTemplateDto.rules;
      }

      if (updateFormTemplateDto.tags) {
        mongoTemplate.tags = updateFormTemplateDto.tags;
      }

      // Salvar as alterações
      await mongoTemplate.save();
      await queryRunner.manager.save(pgTemplate);

      await queryRunner.commitTransaction();

      this.logger.log(`FormTemplate updated successfully: ${id}`);
      return pgTemplate;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to update FormTemplate: ${error.message}`,
        error.stack,
      );
      throw new HttpException(error.message, 400);
    } finally {
      await queryRunner.release();
    }
  }

  private validateAndPrepareSessions(sessions: any[]): void {
    if (sessions.length > 0) {
      const fieldNames = new Set();
      sessions.forEach((session, sessionIndex) => {
        if (!session.name) {
          throw new BadRequestException(
            `A sessão ${sessionIndex + 1} deve ter um nome`,
          );
        }

        if (session.fields && session.fields.length > 0) {
          session.fields.forEach((field, fieldIndex) => {
            if (!field.name) {
              throw new BadRequestException(
                `O campo ${fieldIndex + 1} na sessão "${session.name}" deve ter um nome`,
              );
            }

            if (fieldNames.has(field.name)) {
              throw new ConflictException(
                `Nome de campo duplicado entre sessões: "${field.name}"`,
              );
            }

            fieldNames.add(field.name);

            // Garantir que as propriedades obrigatórias estejam definidas
            field.order = field.order ?? fieldIndex;
            field.validations = field?.validations ?? { required: false };
            field.metadata = field?.metadata ?? [];
          });
        }
      });
    }
  }
}
