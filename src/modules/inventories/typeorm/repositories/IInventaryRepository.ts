import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { Inventary } from '../entities/Inventary.entity';
import { CreateInventaryDto } from '@modules/inventories/dto/CreateInventaryDto';

export default interface IInventaryRepository {
  create(data: CreateInventaryDto): Promise<Inventary>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Inventary | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateInventaryDto): Promise<Inventary>;
}
