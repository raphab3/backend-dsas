import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { Inventory } from '../entities/Inventory.entity';
import { CreateInventaryDto } from '@modules/inventories/dto/CreateInventaryDto';

export default interface IInventaryRepository {
  create(data: CreateInventaryDto): Promise<Inventory>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Inventory | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateInventaryDto): Promise<Inventory>;
}
