import { IDependent } from './IDependent';

export type ICreateDependent = Omit<
  IDependent,
  'id' | 'created_at' | 'updated_at' | 'sig_person'
> & {
  matricula: string;
  person_sigs?: {
    id: string;
  }[];
};
