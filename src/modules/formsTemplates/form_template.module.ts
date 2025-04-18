import AuditModule from '@modules/audits/Audit.module';
import { CreateFormTemplateService } from './services/create.form_template.service';
import { DatabasesModule } from '@shared/databases/databases.module';
import { FindAllFormTemplateService } from './services/findAll.form_template.service';
import { FormTemplate } from './entities/forms_template.entity';
import { FormTemplateController } from './controllers/form_template.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/typeorm/entities/user.entity';
import {
  FormTemplateMongo,
  FormTemplateMongoSchema,
} from './schemas/forms_template.schema';
import { UpdateFormTemplateService } from './services/UpdateFormTemplate.service';
import { GetFormTemplateByIdService } from './services/GetFormTemplateById.service';
import { Location } from '@modules/locations/typeorm/entities/location.entity';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([
  FormTemplate,
  User,
  Location,
]);
const SCHEMA_TEMPLATES = MongooseModule.forFeature([
  { name: FormTemplateMongo.name, schema: FormTemplateMongoSchema },
]);

@Module({
  controllers: [FormTemplateController],
  providers: [
    CreateFormTemplateService,
    FindAllFormTemplateService,
    UpdateFormTemplateService,
    GetFormTemplateByIdService,
  ],
  exports: [CreateFormTemplateService],
  imports: [TYPE_ORM_TEMPLATES, SCHEMA_TEMPLATES, AuditModule, DatabasesModule],
})
export class FormTemplateModule {}
