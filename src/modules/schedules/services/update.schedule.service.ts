import { Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';
import ProfessionalRepository from '@modules/professionals/typeorm/repositories/ProfessionalRepository';
import { IUpdateSchedule } from '../interfaces/ISchedule';

@Injectable()
export class UpdateScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const scheduleExists = this.scheduleRepository.findOne(id);

    const professionalExists = await this.professionalRepository.findOne(
      updateScheduleDto.professional_id,
    );

    const description = `${professionalExists.person_sig.nome}`
      .replace(/\s+/g, ' ')
      .trim();

    if (!scheduleExists) {
      throw new Error('Schedule not found');
    }

    const schedule: IUpdateSchedule = {
      available_date: updateScheduleDto.available_date.split('T')[0],
      description,
      professional: {
        id: updateScheduleDto.professional_id,
      },
      location: {
        id: updateScheduleDto.location_id,
      },
      specialty: {
        id: updateScheduleDto.specialty_id,
      },
      start_time: updateScheduleDto.start_time,
      end_time: updateScheduleDto.end_time,
      max_patients: updateScheduleDto.max_patients,
    };

    console.log('schedule', schedule);

    return this.scheduleRepository.update(id, schedule);
  }
}
