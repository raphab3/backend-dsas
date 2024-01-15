import { IProfessional } from '@modules/professionals/interfaces/IProfessional';
import { ISpecialty } from '@modules/specialties/interfaces/ISpecialty';

export interface ISchedule {
  id: string;
  code: number;
  description: string;
  available_date: string;
  start_time: string;
  end_time: string;
  max_patients: number;
  patients_attended: number;
  status: boolean;
  professional: IProfessional;
  specialty: ISpecialty;
  created_at: Date;
  updated_at: Date;
}
