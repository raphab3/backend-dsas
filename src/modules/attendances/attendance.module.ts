import { StartAttendanceService } from './services/start.attendance.service';
import { FindAllAttendanceService } from './services/findAll.attendance.service';
import { FindOneAttendanceService } from './services/findOne.attendance.service';
import { Module } from '@nestjs/common';
import { RemoveAttendanceService } from './services/remove.attendance.service';
import { Attendance } from './entities/attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuditModule from '@modules/audits/Audit.module';
import { AttendanceController } from './controllers/attendance.controller';
import { UpdateStatusAttendanceService } from './services/updateStatus.attendance.service';
import { GroupFormTemplate } from '@modules/groupFormTemplates/entities/groupFormTemplate.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { FormsResponseModule } from '@modules/formResponses/form_responses.module';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { ClinicalMetricModule } from '@modules/clinicalMetrics/clinicalMetric.module';
import {
  FormResponseMongo,
  FormResponseMongoSchema,
} from '@modules/formResponses/schemas/form_response.schema';
import {
  FormTemplateMongo,
  FormTemplateMongoSchema,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import { MongooseModule } from '@nestjs/mongoose';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([
  Attendance,
  GroupFormTemplate,
  Patient,
  Professional,
  Appointment,
]);

const SCHEMA_TEMPLATES = MongooseModule.forFeature([
  { name: FormResponseMongo.name, schema: FormResponseMongoSchema },
  { name: FormTemplateMongo.name, schema: FormTemplateMongoSchema },
]);

@Module({
  controllers: [AttendanceController],
  providers: [
    FindOneAttendanceService,
    FindAllAttendanceService,
    RemoveAttendanceService,
    UpdateStatusAttendanceService,
    StartAttendanceService,
  ],
  imports: [
    TYPE_ORM_TEMPLATES,
    SCHEMA_TEMPLATES,
    AuditModule,
    FormsResponseModule,
    ClinicalMetricModule,
  ],
})
export class AttendanceModule {}
