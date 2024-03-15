import { IQuery } from '@shared/interfaces/IQuery';

export interface IQueryLocations extends IQuery {
  name?: string;
  description?: string;
  city?: string;
  person_sig_id?: string;
}
