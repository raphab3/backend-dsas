import { Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';
import { QueryAppointmentDto } from '../dto/query-Appointment.dto';

@Injectable()
export class FindAllAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async findAll(query: QueryAppointmentDto): Promise<any> {
    console.log('query', query);
    return this.appointmentRepository.list({
      ...query,
    });
  }
}
