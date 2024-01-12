import { Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class FindAllAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async findAll(): Promise<any> {
    return this.appointmentRepository.list();
  }
}
