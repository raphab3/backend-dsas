import { Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class RemoveAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}
  remove(id: string) {
    return this.appointmentRepository.delete(id);
  }
}
