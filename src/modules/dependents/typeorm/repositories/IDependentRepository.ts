import { Dependent } from '../entities/dependent.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { ICreateDependent } from '@modules/dependents/interfaces/ICreateDependent';
import { IUpdateDependent } from '@modules/dependents/interfaces/IUpdateDependent';

export default interface IDependentRepository {
  create(data: ICreateDependent): Promise<Dependent>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Dependent | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: IUpdateDependent): Promise<Dependent>;
}
