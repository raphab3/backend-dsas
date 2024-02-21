import { Appointment } from '../entities/Appointment.entity';
import { UpdateAppointmentDto } from '@modules/appointments/dto/update-Appointment.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { ICreateAppointment } from '@modules/appointments/interfaces/ICreateAppintment';

export default interface IAppointmentRepository {
  create(data: ICreateAppointment): Promise<Appointment>;
  list(query: any): Promise<IPaginatedResult<Appointment>>;
  findOne(id: string): Promise<Appointment | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<UpdateAppointmentDto>): Promise<Appointment>;
  existsAppointmentForPatientSchedule(
    patient_id: string,
    schedule_id: string,
  ): Promise<boolean>;
}
