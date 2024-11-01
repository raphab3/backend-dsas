import { IQuery } from '@shared/interfaces/IQuery';

export interface IQueryProfessional extends IQuery {
  matricula?: string;
  person_sig_id?: string;
  name?: string;
  specialty?: string;
  specialty_id?: string;
  location_id?: string;
}
