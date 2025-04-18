import { IQuery } from '@shared/interfaces/IQuery';
import { FindOperator } from 'typeorm/find-options/FindOperator';

export interface IUserQuery extends IQuery {
  id?: FindOperator<string> | string | any;
  name?: FindOperator<string> | string;
  email?: FindOperator<string> | string;
  matricula?: FindOperator<string> | string;
  role?: FindOperator<string> | string;
  person_sig?: {
    matricula?: FindOperator<string> | string;
  };
  role_id?: FindOperator<string> | string;
  location_id?: FindOperator<string> | string;
  search?: FindOperator<string> | string;
}
