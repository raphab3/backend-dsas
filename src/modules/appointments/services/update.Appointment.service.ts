import { Injectable } from '@nestjs/common';
import { UpdateAppointmentDto } from '../dto/update-Appointment.dto';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class UpdateAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    if (!id) {
      throw new Error('Appointment is required');
    }

    const appointment = await this.appointmentRepository.findOne(id);

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const dataUpdate = {
      ...appointment,
      status: updateAppointmentDto.status,
      schedule_id: appointment.schedule.id,
      patient_id: appointment.patient.id,
    };

    return this.appointmentRepository.update(id, dataUpdate);
  }
}
