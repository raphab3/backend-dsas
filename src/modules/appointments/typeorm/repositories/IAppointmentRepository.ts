import { CreateAppointmentDto } from '@modules/appointments/dto/create-Appointment.dto';
import { Appointment } from '../entities/Appointment.entity';
import { UpdateAppointmentDto } from '@modules/appointments/dto/update-Appointment.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface IAppointmentRepository {
  create(data: CreateAppointmentDto): Promise<Appointment>;
  list(query: any): Promise<IPaginatedResult<Appointment>>;
  findOne(id: string): Promise<Appointment | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<UpdateAppointmentDto>): Promise<Appointment>;
}
