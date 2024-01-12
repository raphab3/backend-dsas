import { CreateAppointmentDto } from '@modules/Appointments/dto/create-Appointment.dto';
import { Appointment } from '../entities/Appointment.entity';

export default interface IAppointmentRepository {
  create(data: CreateAppointmentDto): Promise<Appointment>;
  list(): Promise<Appointment[]>;
  findOne(id: string): Promise<Appointment | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateAppointmentDto): Promise<Appointment>;
}
