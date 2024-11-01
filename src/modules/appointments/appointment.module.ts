import AppointmentRepository from './typeorm/repositories/AppointmentRepository';
import AuditModule from '@modules/audits/Audit.module';
import { Appointment } from './typeorm/entities/Appointment.entity';
import { AppointmentController } from './controllers/Appointment.controller';
import { CreateAppointmentService } from './services/create.Appointment.service';
import { CreateEndUserAppointmentService } from './services/createEnduser.Appointment.service';
import { DependentModule } from '@modules/dependents/dependent.module';
import { EventsModule } from '@shared/events/Events.module';
import { FindAllAppointmentService } from './services/findAll.Appointment.service';
import { FindAllByEnduserAppointmentService } from './services/findAllByEndUserAppointment.service';
import { FindOneAppointmentService } from './services/findOne.Appointment.service';
import { Module } from '@nestjs/common';
import { PatientModule } from '@modules/patients/patient.module';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { PersonSigModule } from '@modules/persosnSig/personSig.module';
import { RemoveAppointmentService } from './services/remove.Appointment.service';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { ScheduleModule } from '@modules/schedules/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateAppointmentService } from './services/update.Appointment.service';
import { FindAlAppointmentsV2Service } from './services/findAllAppointmentsV2.service';

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
    FindAlAppointmentsV2Service,
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
