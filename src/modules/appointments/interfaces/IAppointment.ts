import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { ISchedule } from '@modules/schedules/interfaces/ISchedule';

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
  schedule: ISchedule;
  patient: Patient;
  status: StatusAppointmentType;
  created_at: Date;
  updated_at: Date;
}
