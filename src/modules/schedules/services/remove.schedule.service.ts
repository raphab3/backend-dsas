import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

@Injectable()
export class RemoveScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}
  remove(id: string) {
    return this.scheduleRepository.delete(id);
  }
}
