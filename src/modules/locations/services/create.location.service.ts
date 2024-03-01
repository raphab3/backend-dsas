import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';

@Injectable()
export class CreateLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async execute(createLocationDto: any) {
    await this.locationRepository.create(createLocationDto);
  }
}
