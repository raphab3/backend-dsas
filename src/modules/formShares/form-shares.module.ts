import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { FormShareToken } from './entities/formShareToken.entity';
import { FormShareService } from './services/form-share.service';
import { FormShareController } from './controllers/form-share.controller';
import { PublicFormController } from './controllers/public-form.controller';
import { PublicFormResponseService } from './services/public-form-response.service';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import {
  FormResponseMongo,
  FormResponseMongoSchema,
} from '@modules/formResponses/schemas/form_response.schema';
import AuditModule from '@modules/audits/Audit.module';
import { ConfigModule } from '@nestjs/config';
import {
  FormTemplateMongo,
  FormTemplateMongoSchema,
} from '@modules/formsTemplates/schemas/forms_template.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormShareToken, Patient, Attendance]),
    MongooseModule.forFeature([
      { name: FormResponseMongo.name, schema: FormResponseMongoSchema },
      { name: FormTemplateMongo.name, schema: FormTemplateMongoSchema },
    ]),
    AuditModule,
    ConfigModule,
  ],
  controllers: [FormShareController, PublicFormController],
  providers: [FormShareService, PublicFormResponseService],
  exports: [FormShareService, PublicFormResponseService],
})
export class FormSharesModule {}
