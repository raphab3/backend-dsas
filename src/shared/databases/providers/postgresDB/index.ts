import env from '@config/env';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Asset } from '@modules/assets/typeorm/entities/Asset.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Audit } from '@modules/audits/typeorm/entities/Audit.entity';
import { ClinicalMetric } from '@modules/clinicalMetrics/entities/clinicalMetric.entity';
import { Dependent } from '@modules/dependents/typeorm/entities/dependent.entity';
import { Certificate } from '@modules/DigitalSignatures/entities/certificate.entity';
import { DocumentSignature } from '@modules/DigitalSignatures/entities/document-signature.entity';
import { Document } from '@modules/Documents/entities/document.entity';
import { DocumentVersion } from '@modules/Documents/entities/documentVersion.entity';
import { SignatureRequirement } from '@modules/Documents/entities/signatureRequirement.entity';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { GroupFormTemplate } from '@modules/groupFormTemplates/entities/groupFormTemplate.entity';
import { Inventory } from '@modules/inventories/typeorm/entities/Inventory.entity';
import { City } from '@modules/locations/typeorm/entities/city.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { PatientAllergy } from '@modules/patientHealth/entities/allergy.entity';
import { ChronicCondition } from '@modules/patientHealth/entities/chronicCondition.entity';
import { Cid } from '@modules/cids/entities/cid.entity';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Trainee } from '@modules/trainees/entities/trainee.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { VitalSigns } from '@modules/VitalSigns/entities/VitalSigns.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions, DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import Attachment from '@modules/attachments/entities/Attachment';
import { AttendanceAttachment } from '@modules/attendances/entities/attendanceAttachment.entity';
import { FormShareToken } from '@modules/formShares/entities/formShareToken.entity';

export const entities = [
  User,
  Patient,
  PersonSig,
  Location,
  Specialty,
  Professional,
  Inventory,
  Asset,
  Dependent,
  Audit,
  Role,
  Permission,
  Schedule,
  Appointment,
  City,
  Trainee,
  FormTemplate,
  Attendance,
  GroupFormTemplate,
  ClinicalMetric,
  VitalSigns,
  Document,
  DocumentVersion,
  SignatureRequirement,
  Certificate,
  DocumentSignature,
  PatientAllergy,
  ChronicCondition,
  Cid,
  Attachment,
  AttendanceAttachment,
  FormShareToken,
];

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: [...entities],
  synchronize: true,
};

export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: [...entities],
  synchronize: false,
  dropSchema: false,
  logging: true,
  logger: 'advanced-console',
  entitySkipConstructor: true,
  migrationsRun: false,
  migrations: ['dist/shared/databases/providers/postgresDB/migrations/*.js'],
} as PostgresConnectionOptions);

export const TYPE_ORM_MODULE = TypeOrmModule.forRoot({
  ...databaseConfig,
});
