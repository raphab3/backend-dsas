import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';
import { CreateAppointmentDto } from '../dto/create-Appointment.dto';
import ScheduleRepository from '@modules/schedules/typeorm/repositories/ScheduleRepository';

@Injectable()
export class CreateAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async execute(createAppointmentDto: CreateAppointmentDto) {
    const schedule = await this.scheduleRepository.findOne(
      createAppointmentDto.schedule_id,
    );

    if (schedule.max_patients <= schedule.patients_attended) {
      throw new HttpException('Schedule is full', HttpStatus.CONFLICT);
    }

    if (!createAppointmentDto.patient_id) {
      throw new Error('Patient is required');
    }

    if (!createAppointmentDto.schedule_id) {
      throw new Error('Schedule is required');
    }

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const saved = await this.appointmentRepository.create(createAppointmentDto);

    this.scheduleRepository.update(schedule.id, {
      ...schedule,
      patients_attended: schedule.patients_attended + 1,
    });

    return saved;
  }
}
