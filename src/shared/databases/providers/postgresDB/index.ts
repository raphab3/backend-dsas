import env from '@config/env';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Asset } from '@modules/assets/typeorm/entities/Asset.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Audit } from '@modules/audits/typeorm/entities/Audit.entity';
import { Dependent } from '@modules/dependents/typeorm/entities/dependent.entity';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { GroupFormTemplate } from '@modules/groupFormTemplates/entities/groupFormTemplate.entity';
import { Inventory } from '@modules/inventories/typeorm/entities/Inventory.entity';
import { City } from '@modules/locations/typeorm/entities/city.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { PatientRecord } from '@modules/patientRecords/entities/patientRecord.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Trainee } from '@modules/trainees/entities/trainee.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions, DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
  PatientRecord,
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
