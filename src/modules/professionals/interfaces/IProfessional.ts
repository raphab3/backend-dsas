import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import { ISpecialty } from '@modules/specialties/interfaces/ISpecialty';
import { IUser } from '@modules/users/interfaces/user.interface';

export interface IProfessional {
  id: string;
  crm: string;
  user: IUser;
  person_sig: IPersonSig;
  specialties: Partial<ISpecialty>[];
  created_at: Date;
  updated_at: Date;
}
