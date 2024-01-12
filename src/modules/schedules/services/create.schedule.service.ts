import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

@Injectable()
export class CreateScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(createScheduleDto: any) {
    const saved = await this.scheduleRepository.create(createScheduleDto);
    console.log('CreateScheduleService -> saved', saved);
  }
}
