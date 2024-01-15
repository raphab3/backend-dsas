import { Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

interface IUpdateRequest extends UpdateScheduleDto {
  professional?: {
    id: string;
  };
  specialty?: {
    id: string;
  };
}

@Injectable()
export class UpdateScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}
  update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule: IUpdateRequest = {};

    for (const key in updateScheduleDto) {
      if (updateScheduleDto[key] !== undefined) {
        if (key === 'professional_id') {
          schedule.professional = { id: updateScheduleDto.professional_id };
        } else if (key === 'specialty_id') {
          schedule.specialty = { id: updateScheduleDto.specialty_id };
        } else if (key === 'available_date') {
          schedule.available_date =
            updateScheduleDto.available_date.split('T')[0];
        } else {
          schedule[key] = updateScheduleDto[key];
        }
      }
    }

    return this.scheduleRepository.update(id, schedule);
  }
}
