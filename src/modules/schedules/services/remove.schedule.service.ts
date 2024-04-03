import { HttpException, Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';

@Injectable()
export class RemoveScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}
  async remove(id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findOne(id);

    if (!schedule) {
      throw new HttpException('Agenda não encontrada', 404);
    }

    if (schedule.appointments.length > 0) {
      throw new HttpException(
        'Agenda com agendamentos não pode ser removida',
        400,
      );
    }

    return await this.scheduleRepository.delete(id);
  }
}
