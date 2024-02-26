import { AppointmentModule } from '@modules/appointments/appointment.module';
import { AssetModule } from '@modules/assets/Asset.module';
import { AuditModule } from '@modules/audits/Audit.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CONFIGS_MODULES, PROVIDERS } from './config.module';
import { DependentModule } from '@modules/dependents/dependent.module';
import { InvetaryModule } from '@modules/inventories/Inventery.module';
import { Module } from '@nestjs/common';
import { PatientModule } from '@modules/patients/patient.module';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { ScheduleModule } from '@modules/schedules/schedule.module';
import { SpecialtyModule } from '@modules/specialties/Specialty.module';
import { UsersModule } from '@modules/users/users.module';
import { RoleModule } from '@modules/roles/role.module';
import { PermissionModule } from '@modules/permissions/permission.module';
import { SeedsModule } from '@modules/seeds/seeds.module';

export const MODULES = [
  UsersModule,
  AuthModule,
  PatientModule,
  PersonSigModule,
  ScheduleModule,
  AppointmentModule,
  SpecialtyModule,
  ProfessionalModule,
  InvetaryModule,
  AssetModule,
  DependentModule,
  AuditModule,
  RoleModule,
  PermissionModule,
  SeedsModule,
];

@Module({
  imports: [...CONFIGS_MODULES, ...MODULES],
  providers: [...PROVIDERS],
  controllers: [],
  exports: [...CONFIGS_MODULES],
})
export class AppModule {}
