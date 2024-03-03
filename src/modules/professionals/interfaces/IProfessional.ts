import { ILocation } from '@modules/locations/interfaces/ILocation';
import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import { ISpecialty } from '@modules/specialties/interfaces/ISpecialty';

export interface IProfessional {
  id?: string;
  council?: string;
  person_sig: Partial<IPersonSig>;
  specialties?: Partial<ISpecialty>[];
  locations?: Partial<ILocation>[];
  created_at: Date;
  updated_at: Date;
}

export interface ICreateProfessional
  extends Omit<IProfessional, 'created_at' | 'updated_at'> {}

export interface IUpdateProfessional
  extends Omit<IProfessional, 'created_at' | 'updated_at' | 'person_sig'> {}
