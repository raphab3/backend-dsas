import { Injectable } from '@nestjs/common';
import { UpdateLocationDto } from '../dto/update-location.dto';
import LocationRepository from '../typeorm/repositories/LocationRepository';

@Injectable()
export class UpdateLocationService {
  constructor(private readonly locationRepository: LocationRepository) {}
  update(id: string, updateLocationDto: UpdateLocationDto) {
    return this.locationRepository.update(id, updateLocationDto);
  }
}
