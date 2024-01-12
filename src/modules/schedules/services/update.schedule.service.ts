import { Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

@Injectable()
export class UpdateScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}
  update(id: string, updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleRepository.update(id, updateScheduleDto);
  }
}
