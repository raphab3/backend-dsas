import { Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class CreateAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(createAppointmentDto: any) {
    const saved = await this.appointmentRepository.create(createAppointmentDto);
    console.log('CreateAppointmentService -> saved', saved);
  }
}
