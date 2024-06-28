import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';
import { IQuerySchedule } from '../interfaces/IQuerySchedule';
import LocationRepository from '@modules/locations/typeorm/repositories/LocationRepository';

@Injectable()
export class FindAllScheduleEndUserService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async findAll(query: IQuerySchedule): Promise<any> {
    const locations = await this.locationRepository.list({
      perPage: 999999999,
    });

    const userLocations = locations.data.map((loc) => loc.id);

    return this.scheduleRepository.list({
      ...query,
      is_enduser: true,
      locations: userLocations,
    });
  }
}
