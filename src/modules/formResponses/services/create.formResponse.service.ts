import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '../schemas/form_response.schema';
import { CreateFormResponseDto } from '../dto/create-form_response.dto';

@Injectable()
export class CreateFormResponseService {
  private readonly logger = new Logger(CreateFormResponseService.name);

  constructor(
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormResponseMongo.name)
    private formResponseMongoModel: Model<FormResponseMongoDocument>,
  ) {}

  async execute(createFormResponseDto: CreateFormResponseDto) {
    const queryRunner =
      this.formTemplateRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { templateId, type, responses, metadata } = createFormResponseDto;

      const template = await this.formTemplateRepository.findOne({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotFoundException(
          `FormTemplate with id ${templateId} not found`,
        );
      }

      const mongoResponse = new this.formResponseMongoModel({
        templateId: template.mongoTemplateId,
        createdBy: createFormResponseDto.createdBy,
        type,
        responses,
        metadata,
      });
      const savedMongoResponse = await mongoResponse.save();

      await queryRunner.commitTransaction();

      return savedMongoResponse;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to create FormResponse: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create form response');
    } finally {
      await queryRunner.release();
    }
  }
}
