import AuditModule from '@modules/audits/Audit.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppLoggingInterceptor } from '@shared/interceptors/AppLoggerInterceptor';
import { AppointmentModule } from '@modules/appointments/appointment.module';
import { AssetModule } from '@modules/assets/Asset.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CacheModuleCustom } from '@shared/providers/Cache/cache.module';
import { DependentModule } from '@modules/dependents/dependent.module';
import { EventsModule } from '@shared/events/Events.module';
import { GatewaysModule } from '@shared/gateways/gateways.module';
import { InvetaryModule } from '@modules/inventories/Inventery.module';
import { JobModule } from './jobs/Job.module';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { LocationModule } from '@modules/locations/location.module';
import { LocationsGuard } from '@shared/guards/Location.guard';
import { PatientModule } from '@modules/patients/patient.module';
import { PatientHealthModule } from '@modules/patientHealth/patient-health.module';
import { PermissionModule } from '@modules/permissions/permission.module';
import { PermissionsGuard } from '@shared/guards/Permissions.guard';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { RoleModule } from '@modules/roles/role.module';
import { ScheduleModule } from '@modules/schedules/schedule.module';
import { SeedModule } from '@shared/seeders/seed.module';
import { SpecialtyModule } from '@modules/specialties/Specialty.module';
import { StatsModule } from '@modules/stats/Stats.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TimeoutInterceptor } from '@shared/interceptors/TimeoutInterceptor';
import { TraineeModule } from '@modules/trainees/trainee.module';
import { UsersModule } from '@modules/users/users.module';
import { DatabasesModule } from '@shared/databases/databases.module';
import { ProvidersModule } from '@shared/providers/providers.module';
import { FormsResponseModule } from '@modules/formResponses/form_responses.module';
import { FormTemplateModule } from '@modules/formsTemplates/form_template.module';
import { AttendanceModule } from '@modules/attendances/attendance.module';
import { GroupFormTemplateModule } from '@modules/groupFormTemplates/groupFormTemplate.module';
import { VitalSignsModule } from '@modules/VitalSigns/VitalSign.module';
import { DocumentModule } from '@modules/Documents/Document.module';
import { DigitalSignaturesModule } from '@modules/DigitalSignatures/digital-signatures.module';
import { NotificationsModule } from '@shared/providers/Notification/notifications.module';
import { CidModule } from '@modules/cids/cid.module';
import { AttachmentModule } from '@modules/attachments/Attachment.module';
import { GuardModule } from '@shared/guards/guard.module';
import { FormSharesModule } from '@modules/formShares/form-shares.module';

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
  TraineeModule,
  FormsResponseModule,
  FormTemplateModule,
  GroupFormTemplateModule,
  AttendanceModule,
  VitalSignsModule,
  DocumentModule,
  DigitalSignaturesModule,
  PatientHealthModule,
  CidModule,
  AttachmentModule,
  FormSharesModule,
];

export const EXTRA_MODULES = [
  RATE_LIMIT_MODULE,
  DatabasesModule,
  GatewaysModule,
  EventsModule,
  SeedModule,
  CacheModuleCustom,
  ProvidersModule,
  NotificationsModule,
  GuardModule,
];

export const PROVIDERS = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TimeoutInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: AppLoggingInterceptor,
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
