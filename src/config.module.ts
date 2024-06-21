import env from '@config/env';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { AppointmentModule } from '@modules/appointments/appointment.module';
import { Asset } from '@modules/assets/typeorm/entities/Asset.entity';
import { AssetModule } from '@modules/assets/Asset.module';
import { Audit } from '@modules/audits/typeorm/entities/Audit.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { DataSourceOptions } from 'typeorm';
import { Dependent } from '@modules/dependents/typeorm/entities/dependent.entity';
import { DependentModule } from '@modules/dependents/dependent.module';
import { Inventory } from '@modules/inventories/typeorm/entities/Inventory.entity';
import { InvetaryModule } from '@modules/inventories/Inventery.module';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Location } from '@modules/locations/typeorm/entities/location.entity';
import { LocationModule } from '@modules/locations/location.module';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { PatientModule } from '@modules/patients/patient.module';
import { Permission } from '@modules/permissions/typeorm/entities/permission.entity';
import { PermissionModule } from '@modules/permissions/permission.module';
import { PermissionsGuard } from '@shared/guards/Permissions.guard';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { Role } from '@modules/roles/typeorm/entities/role.entity';
import { RoleModule } from '@modules/roles/role.module';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { ScheduleModule } from '@modules/schedules/schedule.module';
import { SeedModule } from '@shared/seeders/seed.module';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { SpecialtyModule } from '@modules/specialties/Specialty.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TimeoutInterceptor } from '@shared/interceptors/TimeoutInterceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { UsersModule } from '@modules/users/users.module';
import { EntityExceptionFilter } from '@shared/interceptors/EntityPropertyNotFoundError';
import { LocationsGuard } from '@shared/guards/Location.guard';
import { City } from '@modules/locations/typeorm/entities/city.entity';
import { JobModule } from './jobs/Job.module';
import { StatsModule } from '@modules/stats/Stats.module';
import AuditModule from '@modules/audits/Audit.module';
import { GatewaysModule } from '@shared/gateways/gateways.module';
import { EventsModule } from '@shared/events/Events.module';

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
];

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: [...entities],
  synchronize: true,
};

export const TYPE_ORM_MODULE = TypeOrmModule.forRoot({
  ...databaseConfig,
});

export const RATE_LIMIT_MODULE = ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 100,
  },
]);

export const MODULES = [
  UsersModule,
  AuthModule,
  ScheduleModule,
  PatientModule,
  PersonSigModule,
  AppointmentModule,
  SpecialtyModule,
  ProfessionalModule,
  InvetaryModule,
  AssetModule,
  DependentModule,
  AuditModule,
  RoleModule,
  PermissionModule,
  LocationModule,
  JobModule,
  StatsModule,
];

export const EXTRA_MODULES = [
  TYPE_ORM_MODULE,
  RATE_LIMIT_MODULE,
  GatewaysModule,
  EventsModule,
  SeedModule,
];

export const PROVIDERS = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_FILTER,
    useClass: EntityExceptionFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TimeoutInterceptor,
  },
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: PermissionsGuard,
  },
  {
    provide: APP_GUARD,
    useClass: LocationsGuard,
  },
];

export const ALL_MODULES = [...MODULES, ...EXTRA_MODULES];
