import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { FormTemplate } from '../entities/forms_template.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '../schemas/forms_template.schema';
import { CreateFormTemplateDto } from '../dto/form-template.dto';

@Injectable()
export class CreateFormTemplateService {
  private readonly logger = new Logger(CreateFormTemplateService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateMongoModel: Model<FormTemplateMongoDocument>,
  ) {}

  async execute(createFormTemplateDto: CreateFormTemplateDto) {
    this.logger.log('Iniciando criação do FormTemplate');

    if (!createFormTemplateDto.createdBy) {
      throw new HttpException('Usuário não informado', 400);
    }

    // Iniciar transação no PostgreSQL
    const queryRunner =
      this.formTemplateRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const existUser = await this.userRepository.findOne({
      where: { id: createFormTemplateDto.createdBy },
    });

    if (!existUser) {
      await queryRunner.release();
      throw new HttpException('Usuário não encontrado', 404);
    }

    // Variável para armazenar o ID do documento MongoDB criado
    let savedMongoTemplate: FormTemplateMongoDocument | null = null;

    try {
      // Validar DTO
      if (createFormTemplateDto?.sessions?.length) {
        this.validateCreateFormTemplateDto(createFormTemplateDto);
      }

      // Criar documento no MongoDB
      const mongoTemplate = new this.formTemplateMongoModel({
        name: createFormTemplateDto.name,
        description: createFormTemplateDto.description,
        category: createFormTemplateDto.category,
        sessions: createFormTemplateDto.sessions || [],
        rules: createFormTemplateDto.rules,
        tags: createFormTemplateDto.tags,
        createdBy: createFormTemplateDto.createdBy,
        isPublished: false,
      });

      savedMongoTemplate = await mongoTemplate.save();

      // Criar entidade no PostgreSQL
      const pgTemplate = this.formTemplateRepository.create({
        name: createFormTemplateDto.name,
        description: createFormTemplateDto.description,
        mongoTemplateId: savedMongoTemplate._id.toString(),
        category: createFormTemplateDto.category,
        createdBy: { id: createFormTemplateDto.createdBy },
        isPublished: false,
      });

      const savedPgTemplate = await queryRunner.manager.save(pgTemplate);

      // Confirmar transação no PostgreSQL
      await queryRunner.commitTransaction();

      this.logger.log(`FormTemplate criado com sucesso: ${savedPgTemplate.id}`);
      return savedPgTemplate;
    } catch (error) {
      // Reverter transação no PostgreSQL
      await queryRunner.rollbackTransaction();

      this.logger.error(
        `Falha ao criar FormTemplate: ${error.message}`,
        error.stack,
      );

      // Compensar operação no MongoDB, se necessário
      if (savedMongoTemplate) {
        try {
          await this.formTemplateMongoModel.deleteOne({
            _id: savedMongoTemplate._id,
          });
          this.logger.log(
            `Documento MongoDB com ID ${savedMongoTemplate._id} removido devido à falha na transação PostgreSQL.`,
          );
        } catch (mongoError) {
          this.logger.error(
            `Falha ao remover documento MongoDB: ${mongoError.message}`,
            mongoError.stack,
          );
          // Opcional: Você pode lançar uma exceção ou apenas registrar o erro
        }
      }

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new HttpException(error.message, 400);
    } finally {
      // Liberar o queryRunner
      await queryRunner.release();
    }
  }

  private validateCreateFormTemplateDto(dto: CreateFormTemplateDto): void {
    if (dto.sessions.length === 0) {
      throw new ConflictException(
        'FormTemplate deve ter pelo menos uma sessão',
      );
    }

    const fieldNames = new Set();
    for (const session of dto.sessions) {
      if (session.fields.length === 0) {
        throw new ConflictException(
          `Sessão "${session.name}" deve ter pelo menos um campo`,
        );
      }

      for (const field of session.fields) {
        if (fieldNames.has(field.name)) {
          throw new ConflictException(
            `Nome de campo duplicado nas sessões: ${field.name}`,
          );
        }
        fieldNames.add(field.name);
      }
    }

    // Validação adicional para regras, se necessário
    if (dto.rules && dto.rules.length > 0) {
      // Implementar validação de regras aqui
    }
  }
}
