import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';
import { IQuerySchedule } from '../interfaces/IQuerySchedule';

@Injectable()
export class FindAllScheduleEndUserService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async findAll(query: IQuerySchedule): Promise<any> {
    return this.scheduleRepository.list({
      ...query,
      is_enduser: true,
    });
  }
}
