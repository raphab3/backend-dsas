import { IQuery } from '@shared/interfaces/IQuery';

export interface IQueryPersonSig extends IQuery {
  id?: string;
  matricula?: string;
  nome?: string;
}
