import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';

@Injectable()
export class FindOneLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}
  async findOne(id: string): Promise<any> {
    return this.locationRepository.findOne(id);
  }
}
