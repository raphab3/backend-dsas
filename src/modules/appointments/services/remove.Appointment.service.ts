import { HttpException, Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';
import { EventsService } from '@shared/events/EventsService';

@Injectable()
export class RemoveAppointmentService {
  constructor(
    private readonly eventsService: EventsService,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}
  async remove(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne(id);

    if (!appointment) {
      throw new HttpException('Consulta não encontrada', 404);
    }

    if (appointment.status !== 'scheduled') {
      throw new HttpException(
        'Apenas consultas com status "agendado" podem ser removidos',
        400,
      );
    }

    await this.appointmentRepository.remove(appointment);
    this.eventsService.emit('statsUpdated');
  }
}
