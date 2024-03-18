import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

@Injectable()
export class RemoveScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}
  async remove(id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne(id);

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    if (schedule.appointments.length > 0) {
      throw new Error('Agenda com agendamentos não pode ser removida');
    }

    return await this.scheduleRepository.delete(id);
  }
}
