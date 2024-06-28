import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { StatusAppointmentEnum } from '../interfaces/IAppointment';
import { UpdateAppointmentDto } from '../dto/update-Appointment.dto';
import { EventsService } from '@shared/events/EventsService';

@Injectable()
export class UpdateAppointmentService {
  constructor(
    private readonly eventsService: EventsService,
    private readonly appointmentRepository: AppointmentRepository,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    if (!id) {
      throw new HttpException('Id do agendamento não informado', 400);
    }

    const appointment = await this.appointmentRepository.findOne(id);

    if (!appointment) {
      throw new HttpException('Agendamento não encontrado', 404);
    }

    const dataUpdate = {
      ...appointment,
      status: updateAppointmentDto.status,
      schedule_id: appointment.schedule.id,
      patient_id: appointment.patient.id,
    };

    const appointmentUpdated = await this.appointmentRepository.update(
      id,
      dataUpdate,
    );

    await this.syncSchedulePatients(appointment.schedule.id);

    this.eventsService.emit('statsUpdated');

    return appointmentUpdated;
  }

  private async syncSchedulePatients(schedule_id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: schedule_id },
      relations: ['appointments'],
    });

    if (!schedule) {
      console.error('Schedule not found.');
      return;
    }

    const realPatientsAttended = schedule.appointments.filter(
      (app) =>
        app.status === StatusAppointmentEnum.SCHEDULED ||
        app.status === StatusAppointmentEnum.ATTENDED,
    ).length;

    if (schedule.patients_attended !== realPatientsAttended) {
      schedule.patients_attended = realPatientsAttended;
      await schedule.save();
    }
  }
}
