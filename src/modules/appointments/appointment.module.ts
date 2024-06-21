import AppointmentRepository from './typeorm/repositories/AppointmentRepository';
import { Appointment } from './typeorm/entities/Appointment.entity';
import { AppointmentController } from './infra/controllers/Appointment.controller';
import { CreateAppointmentService } from './services/create.Appointment.service';
import { FindAllAppointmentService } from './services/findAll.Appointment.service';
import { FindOneAppointmentService } from './services/findOne.Appointment.service';
import { Module } from '@nestjs/common';
import { RemoveAppointmentService } from './services/remove.Appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateAppointmentService } from './services/update.Appointment.service';
import { ScheduleModule } from '@modules/schedules/schedule.module';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { PatientModule } from '@modules/patients/patient.module';
import { DependentModule } from '@modules/dependents/dependent.module';
import AuditModule from '@modules/audits/Audit.module';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { EventsModule } from '@shared/events/Events.module';
import { FindAllByEnduserAppointmentService } from './services/findAllByEndUserAppointment.service';
import { CreateEndUserAppointmentService } from './services/createEnduser.Appointment.service';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([
  Appointment,
  Schedule,
  PersonSig,
]);

@Module({
  controllers: [AppointmentController],
  providers: [
    AppointmentRepository,
    FindOneAppointmentService,
    CreateAppointmentService,
    CreateEndUserAppointmentService,
    FindAllAppointmentService,
    FindAllByEnduserAppointmentService,
    UpdateAppointmentService,
    RemoveAppointmentService,
  ],
  imports: [
    TYPE_ORM_TEMPLATES,
    ScheduleModule,
    PersonSigModule,
    PatientModule,
    DependentModule,
    AuditModule,
    EventsModule,
  ],
})
export class AppointmentModule {}
