import { IQuery } from '@shared/interfaces/IQuery';

export interface IQueryPatients extends IQuery {
  matricula: string;
  name: string;
}
