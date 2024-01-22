import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';

export const statusAppointmentOfTypeEnum = [
  'scheduled',
  'canceled',
  'missed',
  'attended',
] as const;

export type StatusAppointmentType =
  (typeof statusAppointmentOfTypeEnum)[number];

export interface IAppointment {
  id: string;
  schedule: Schedule;
  patient: Patient;
  status: StatusAppointmentType;
  created_at: Date;
  updated_at: Date;
}
