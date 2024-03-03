import { ILocation } from '@modules/locations/interfaces/ILocation';
import { IProfessional } from '@modules/professionals/interfaces/IProfessional';
import { ISpecialty } from '@modules/specialties/interfaces/ISpecialty';

export interface ISchedule {
  id: string;
  code: number;
  description?: string;
  available_date?: string;
  start_time?: string;
  end_time?: string;
  max_patients?: number;
  patients_attended?: number;
  status?: boolean;
  professional?: Partial<IProfessional>;
  specialty?: Partial<ISpecialty>;
  location?: Partial<ILocation>;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateSchedule
  extends Omit<
    ISchedule,
    'id' | 'created_at' | 'updated_at' | 'code' | 'status' | 'patients_attended'
  > {}

export interface IUpdateSchedule
  extends Omit<
    ISchedule,
    'id' | 'created_at' | 'updated_at' | 'code' | 'status'
  > {}
