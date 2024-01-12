import { AddressModule } from '@modules/adresses/address.module';
import { AppointmentModule } from '@modules/Appointments/Appointment.module';
import { AttachmentModule } from '@modules/attachments/attachment.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CONFIGS_MODULES, PROVIDERS } from './config.module';
import { Module } from '@nestjs/common';
import { PatientModule } from '@modules/patients/patient.module';
import { ScheduleModule } from '@modules/schedules/schedule.module';
import { SpecialtyModule } from '@modules/specialties/Specialty.module';
import { UsersModule } from '@modules/users/users.module';
import { ProfessionalModule } from '@modules/professionals/professional.module';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';

const MODULES = [
  UsersModule,
  AuthModule,
  AddressModule,
  AttachmentModule,
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
