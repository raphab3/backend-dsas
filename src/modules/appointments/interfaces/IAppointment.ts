import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';

export enum StatusAppointmentEnum {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  CANCELED = 'canceled',
  MISSED = 'missed',
  ATTENDED = 'attended',
}

export interface IAppointment {
  id: string;
  schedule: Schedule;
  patient: Patient;
  status: StatusAppointmentEnum;
  created_at: Date;
  updated_at: Date;
}
