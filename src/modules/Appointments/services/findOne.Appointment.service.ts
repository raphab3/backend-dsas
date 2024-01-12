import { Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class FindOneAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}
  async findOne(id: string): Promise<any> {
    return this.appointmentRepository.findOne(id);
  }
}
