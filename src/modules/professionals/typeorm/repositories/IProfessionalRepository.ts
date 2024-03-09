import { Professional } from '../entities/professional.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import {
  ICreateProfessional,
  IUpdateProfessional,
} from '@modules/professionals/interfaces/IProfessional';
import { IQueryProfessional } from '@modules/professionals/interfaces/IQueryProfessional';

export default interface IProfessionalRepository {
  create(data: ICreateProfessional): Promise<Professional>;
  list(query: IQueryProfessional): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Professional | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: IUpdateProfessional): Promise<Professional>;
}
