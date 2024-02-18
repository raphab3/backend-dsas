import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import { ISpecialty } from '@modules/specialties/interfaces/ISpecialty';

export interface IProfessional {
  id: string;
  crm: string;
  person_sig: Partial<IPersonSig>;
  specialties: Partial<ISpecialty>[];
  created_at: Date;
  updated_at: Date;
}

export interface ICreateProfessional
  extends Omit<IProfessional, 'id' | 'created_at' | 'updated_at'> {}
