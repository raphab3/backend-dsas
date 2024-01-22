import { AppointmentModule } from '@modules/appointments/appointment.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CONFIGS_MODULES, PROVIDERS } from './config.module';
import { Module } from '@nestjs/common';
import { PatientModule } from '@modules/patients/patient.module';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { ScheduleModule } from '@modules/schedules/schedule.module';
import { SpecialtyModule } from '@modules/specialties/Specialty.module';
import { UsersModule } from '@modules/users/users.module';

const MODULES = [
  UsersModule,
  AuthModule,
  PatientModule,
  PersonSigModule,
  ScheduleModule,
  AppointmentModule,
  SpecialtyModule,
  ProfessionalModule,
];

@Module({
  imports: [...CONFIGS_MODULES, ...MODULES],
  providers: [...PROVIDERS],
  controllers: [],
  exports: [...CONFIGS_MODULES],
})
export class AppModule {}