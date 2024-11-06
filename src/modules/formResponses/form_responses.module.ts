import { DatabasesModule } from '@shared/databases/databases.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import {
  FormResponseMongo,
  FormResponseMongoSchema,
} from './schemas/form_response.schema';
import {
  FormTemplateMongo,
  FormTemplateMongoSchema,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import AuditModule from '@modules/audits/Audit.module';
import { CreateFormResponseService } from './services/create.formResponse.service';
import { FormResponseController } from './controllers/form_response.controller';
import { DeleteFormResponseService } from './services/delete.formResponse.service';
import { GenerateFormResultService } from './services/GenerateFormResult.service';
import { GetFormResponseByIdService } from './services/GetFormResponseById.service';
import { UpdateFormResponseService } from './services/update.formResponse.service';

const SCHEMA_TEMPLATES = MongooseModule.forFeature([
  { name: FormResponseMongo.name, schema: FormResponseMongoSchema },
  { name: FormTemplateMongo.name, schema: FormTemplateMongoSchema },
]);
const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([FormTemplate]);

@Module({
  controllers: [FormResponseController],
  providers: [
    CreateFormResponseService,
    DeleteFormResponseService,
    GenerateFormResultService,
    GetFormResponseByIdService,
    UpdateFormResponseService,
  ],
  imports: [TYPE_ORM_TEMPLATES, SCHEMA_TEMPLATES, AuditModule, DatabasesModule],
  exports: [CreateFormResponseService],
})
export class FormsResponseModule {}
