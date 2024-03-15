import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';
import { ICreateLocation } from '../interfaces/ILocation';

@Injectable()
export class UpdateLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}
  update(id: string, updateLocation: ICreateLocation) {
    console.log('updateLocation', updateLocation);
    return this.locationRepository.update(id, updateLocation);
  }
}
