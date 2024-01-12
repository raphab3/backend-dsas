import { IQuery } from '@shared/interfaces/IQuery';
import { FindOperator } from 'typeorm/find-options/FindOperator';

export interface IUserQuery extends IQuery {
  uuid?: FindOperator<string> | string;
  name?: FindOperator<string> | string;
  email?: FindOperator<string> | string;
  role?: FindOperator<string> | string;
}
