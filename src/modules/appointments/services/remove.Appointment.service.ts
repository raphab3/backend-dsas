import { HttpException, Injectable } from '@nestjs/common';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class RemoveAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}
  async remove(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne(id);

    console.log(appointment);

    if (!appointment) {
      throw new HttpException('Consulta não encontrada', 404);
    }

    if (appointment.status !== 'scheduled') {
      throw new HttpException(
        'Apenas consultas com status "agendado" podem ser removidos',
        400,
      );
    }

    await this.appointmentRepository.delete(id);
  }
}
