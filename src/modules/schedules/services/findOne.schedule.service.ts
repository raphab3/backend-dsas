import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

@Injectable()
export class FindOneScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}
  async findOne(id: string): Promise<any> {
    return this.scheduleRepository.findOne(id);
  }
}
