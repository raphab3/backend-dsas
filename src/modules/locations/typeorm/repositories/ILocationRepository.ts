import { CreateLocationDto } from '@modules/locations/dto/create-location.dto';
import { Location } from '../entities/location.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface ILocationRepository {
  create(data: CreateLocationDto): Promise<Location>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Location | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateLocationDto): Promise<Location>;
}
