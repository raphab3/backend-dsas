import { IDependent } from './IDependent';

export type IUpdateDependent = Omit<
  IDependent,
  'id' | 'created_at' | 'updated_at' | 'sig_person'
>;
