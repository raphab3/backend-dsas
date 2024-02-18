import { IAppointment } from '@modules/appointments/interfaces/IAppointment';
import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';

export interface IPatient {
  id: string;
  person_sig: Partial<IPersonSig>;
  appointments: IAppointment[];
  created_at: Date;
  updated_at: Date;
}
