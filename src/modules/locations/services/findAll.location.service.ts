import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';
import { IQueryLocations } from '../interfaces/IQueryLocations';

@Injectable()
export class FindAllLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async findAll(query: IQueryLocations): Promise<any> {
    return this.locationRepository.list({
      ...query,
      schedule_enabled: true,
    });
  }
}
