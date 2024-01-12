import { Injectable } from '@nestjs/common';
import { UpdateAppointmentDto } from '../dto/update-Appointment.dto';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class UpdateAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}
  update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentRepository.update(id, updateAppointmentDto);
  }
}
