import { StartAttendanceService } from './services/start.attendance.service';
import { FindAllAttendanceService } from './services/findAll.attendance.service';
import { FindOneAttendanceService } from './services/findOne.attendance.service';
import { Module, forwardRef } from '@nestjs/common';
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
import { UpdateAttendanceHealthInfoService } from './services/update-attendance-health-info.service';
import { AttendanceHealthInfoController } from './controllers/attendance-health-info.controller';
import { AttendanceAttachment } from './entities/attendanceAttachment.entity';
import { AttendanceAttachmentService } from './services/attendance-attachment.service';
import { AttachmentModule } from '@modules/attachments/Attachment.module';
import Attachment from '@modules/attachments/entities/Attachment';
import { PatientHealthModule } from '@modules/patientHealth/patient-health.module';
import {
  FormResponseMongo,
  FormResponseMongoSchema,
} from '@modules/formResponses/schemas/form_response.schema';
import {
  FormTemplateMongo,
  FormTemplateMongoSchema,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceProcessorService } from './services/attendance-processor.service';
import { BaseFormProcessor } from './services/base-form-processor.service';
import { AddFormResponseService } from './services/add-form-response.service';
import { DeleteFormResponseService } from './services/delete-form-response.service';
import { Document } from '@modules/Documents/entities/document.entity';
import { UpdateAttendanceService } from './services/update.attendance.service';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { ProvidersModule } from '@shared/providers/providers.module';
import { GuardModule } from '@shared/guards/guard.module';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { AttendancePdfService } from './services/attendance-pdf.service';
import { AttendanceSignatureService } from './services/attendance-signature.service';
import { AttendanceSignatureController } from './controllers/attendance-signature.controller';
import { AttendanceSignature } from './entities/attendanceSignature.entity';
import { DigitalSignaturesModule } from '@modules/DigitalSignatures/digital-signatures.module';
import { Certificate } from '@modules/DigitalSignatures/entities/certificate.entity';
import { ExamsModule } from '@modules/patientHealth/nestedsModules/exams/exams.module';
import { ReferralsModule } from '@modules/patientHealth/nestedsModules/referrals/referrals.module';
import { MedicalRecordModule } from '../patientHealth/nestedsModules/medicalRecord/medical-record.module';
import { ClinicalMetricModule } from '../patientHealth/nestedsModules/clinicalMetrics/clinicalMetric.module';
import { ClinicalMetric } from '../patientHealth/nestedsModules/clinicalMetrics/entities/clinicalMetric.entity';
import { PatientMedication } from '@modules/patientHealth/entities/medication.entity';
import { MedicalRecord } from '../patientHealth/nestedsModules/medicalRecord/entities/medical-record.entity';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([
  Attendance,
  GroupFormTemplate,
  Patient,
  Professional,
  Appointment,
  Document,
  Specialty,
  Location,
  ClinicalMetric,
  AttendanceAttachment,
  Attachment,
  User,
  AttendanceSignature,
  Certificate,
  PatientMedication,
  MedicalRecord,
]);

const SCHEMA_TEMPLATES = MongooseModule.forFeature([
  { name: FormResponseMongo.name, schema: FormResponseMongoSchema },
  { name: FormTemplateMongo.name, schema: FormTemplateMongoSchema },
]);

@Module({
  controllers: [
    AttendanceController,
    AttendanceHealthInfoController,
    AttendanceSignatureController,
  ],
  providers: [
    FindOneAttendanceService,
    FindAllAttendanceService,
    RemoveAttendanceService,
    UpdateStatusAttendanceService,
    UpdateAttendanceService,
    StartAttendanceService,
    AttendanceProcessorService,
    BaseFormProcessor,
    AddFormResponseService,
    DeleteFormResponseService,
    UpdateAttendanceHealthInfoService,
    AttendanceAttachmentService,
    AttendancePdfService,
    AttendanceSignatureService,
  ],
  imports: [
    TYPE_ORM_TEMPLATES,
    SCHEMA_TEMPLATES,
    AuditModule,
    ProvidersModule,
    FormsResponseModule,
    ClinicalMetricModule,
    PatientHealthModule,
    AttachmentModule,
    GuardModule,
    ExamsModule,
    ReferralsModule,
    MedicalRecordModule,
    forwardRef(() => DigitalSignaturesModule),
  ],
  exports: [
    StartAttendanceService,
    AttendanceSignatureService,
    TypeOrmModule.forFeature([Attendance]),
  ],
})
export class AttendanceModule {}
