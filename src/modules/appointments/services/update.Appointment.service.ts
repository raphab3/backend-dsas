import { Injectable } from '@nestjs/common';
import { UpdateAppointmentDto } from '../dto/update-Appointment.dto';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class UpdateAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}
  update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    if (!id) {
      throw new Error('Appointment is required');
    }

    if (!updateAppointmentDto.patient_id) {
      throw new Error('Patient is required');
    }

    if (!updateAppointmentDto.schedule_id) {
      throw new Error('Schedule is required');
    }

    return this.appointmentRepository.update(id, updateAppointmentDto);
  }
}
