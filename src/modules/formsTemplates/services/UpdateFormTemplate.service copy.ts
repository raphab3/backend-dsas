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
import { Connection, Model, Types } from 'mongoose';
import { FormTemplate } from '../entities/forms_template.entity';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '../schemas/forms_template.schema';
import { UpdateFormTemplateDto } from '../dto/form-template.dto';

@Injectable()
export class UpdateFormTemplateService {
  private readonly logger = new Logger(UpdateFormTemplateService.name);
  private mongooseConnection: Connection;

  constructor(
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
  ) {
    this.mongooseConnection = this.formTemplateMongoModel.db;
  }

  async execute(id: string, updateFormTemplateDto: UpdateFormTemplateDto) {
    const queryRunner =
      this.formTemplateRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let mongoSession;
    let isTransactionSupported = true;

    try {
      mongoSession = await this.mongooseConnection.startSession();
      await mongoSession.startTransaction();
    } catch (error) {
      this.logger.warn(
        'MongoDB transactions not supported. Proceeding without transaction.',
      );
      isTransactionSupported = false;
      mongoSession = null;
    }

    try {
      const pgTemplate = await queryRunner.manager.findOne(FormTemplate, {
        where: { id },
      });
      if (!pgTemplate) {
        throw new NotFoundException('FormTemplate not found');
      }

      // Update PostgreSQL fields
      Object.assign(pgTemplate, {
        name: updateFormTemplateDto.name ?? pgTemplate.name,
        description:
          updateFormTemplateDto.description ?? pgTemplate.description,
        category: updateFormTemplateDto.category ?? pgTemplate.category,
        isPublished:
          updateFormTemplateDto.isPublished ?? pgTemplate.isPublished,
      });

      // Find and update MongoDB document
      const mongoTemplate = await this.findMongoTemplate(
        pgTemplate.mongoTemplateId,
        mongoSession,
      );
      if (!mongoTemplate) {
        throw new NotFoundException('MongoDB document not found');
      }

      // Update MongoDB fields
      this.updateMongoTemplate(mongoTemplate, updateFormTemplateDto);

      // Save changes
      if (isTransactionSupported) {
        await mongoTemplate.save({ session: mongoSession });
      } else {
        await mongoTemplate.save();
      }
      await queryRunner.manager.save(pgTemplate);

      // Commit transactions
      if (isTransactionSupported) {
        await mongoSession.commitTransaction();
      }
      await queryRunner.commitTransaction();

      this.logger.log(`FormTemplate updated successfully: ${id}`);
      return pgTemplate;
    } catch (error) {
      // Rollback transactions
      if (isTransactionSupported) {
        await mongoSession.abortTransaction();
      }
      await queryRunner.rollbackTransaction();

      this.handleError(error);
    } finally {
      if (mongoSession) {
        mongoSession.endSession();
      }
      await queryRunner.release();
    }
  }

  private async findMongoTemplate(mongoTemplateId: string, session?: any) {
    const query = this.formTemplateMongoModel.findById(mongoTemplateId);
    return session ? query.session(session) : query;
  }

  private updateMongoTemplate(
    mongoTemplate: any,
    updateDto: UpdateFormTemplateDto,
  ) {
    Object.assign(mongoTemplate, {
      name: updateDto.name ?? mongoTemplate.name,
      description: updateDto.description ?? mongoTemplate.description,
      metadata: updateDto.metadata ?? mongoTemplate.metadata,
      rules: updateDto.rules ?? mongoTemplate.rules,
      tags: updateDto.tags ?? mongoTemplate.tags,
    });

    if (updateDto.sessions) {
      this.validateAndPrepareSessions(updateDto.sessions);
      mongoTemplate.sessions = updateDto.sessions.map((session) => ({
        ...session,
        _id: session._id
          ? new Types.ObjectId(session._id)
          : new Types.ObjectId(),
        fields: session.fields.map((field) => ({
          ...field,
          _id: field._id ? new Types.ObjectId(field._id) : new Types.ObjectId(),
        })),
      }));
    }
  }

  private validateAndPrepareSessions(sessions: any[]): void {
    if (sessions.length > 0) {
      const fieldNames = new Set();
      sessions.forEach((session, sessionIndex) => {
        if (!session.name) {
          throw new BadRequestException(
            `Session ${sessionIndex + 1} must have a name`,
          );
        }

        if (session.fields && session.fields.length > 0) {
          session.fields.forEach((field, fieldIndex) => {
            if (!field.name) {
              throw new BadRequestException(
                `Field ${fieldIndex + 1} in session "${session.name}" must have a name`,
              );
            }

            if (fieldNames.has(field.name)) {
              throw new ConflictException(
                `Duplicate field name across sessions: "${field.name}"`,
              );
            }

            fieldNames.add(field.name);

            // Ensure required properties are defined
            field.order = field.order ?? fieldIndex;
            field.validations = field.validations ?? { required: false };
            field.metadata = field.metadata ?? [];
          });
        }
      });
    }
  }

  private handleError(error: any) {
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
  }
}
