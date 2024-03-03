import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';
import { ICreateLocation } from '../interfaces/ILocation';

@Injectable()
export class UpdateLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}
  update(id: string, updateLocation: ICreateLocation) {
    return this.locationRepository.update(id, updateLocation);
  }
}
