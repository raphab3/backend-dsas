import { Injectable } from '@nestjs/common';
import LocationRepository from '../typeorm/repositories/LocationRepository';
import { ICreateLocation } from '../interfaces/ILocation';

@Injectable()
export class CreateLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async execute(createLocationDto: ICreateLocation) {
    await this.locationRepository.create({
      name: createLocationDto.name.trim().toLowerCase(),
      description: createLocationDto.description.trim().toLowerCase(),
      city: createLocationDto.city,
    });
  }
}
