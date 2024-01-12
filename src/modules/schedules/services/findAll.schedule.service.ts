import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

@Injectable()
export class FindAllScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async findAll(): Promise<any> {
    return this.scheduleRepository.list();
  }
}
