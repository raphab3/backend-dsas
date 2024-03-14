import { IQuery } from '@shared/interfaces/IQuery';
import { FindOperator } from 'typeorm/find-options/FindOperator';

export interface IQuerySchedule extends IQuery {
  id?: string;
  year?: string;
  location_id?: string;
  specialty_id?: string;
  professional_matricula?: FindOperator<string> | string;
  locations?: string[];
}
