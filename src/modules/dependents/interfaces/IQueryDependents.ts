import { IQuery } from '@shared/interfaces/IQuery';

export interface IQueryDependents extends IQuery {
  matricula?: string;
  name?: string;
  cpf?: string;
}
