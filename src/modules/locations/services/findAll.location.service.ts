import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';

@Injectable()
export class FindAllLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async findAll(query: any): Promise<any> {
    return this.locationRepository.list(query);
  }
}
