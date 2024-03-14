import { Location } from '../entities/location.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { ICreateLocation } from '@modules/locations/interfaces/ILocation';
import { IQueryLocations } from '@modules/locations/interfaces/IQueryLocations';

export default interface ILocationRepository {
  create(data: ICreateLocation): Promise<Location>;
  list(query: IQueryLocations): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Location | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: ICreateLocation): Promise<Location>;
}
