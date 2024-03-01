import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';

@Injectable()
export class RemoveLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}
  remove(id: string) {
    return this.locationRepository.delete(id);
  }
}
