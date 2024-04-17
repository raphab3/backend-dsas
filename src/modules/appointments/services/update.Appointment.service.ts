import { HttpException, Injectable } from '@nestjs/common';
import { UpdateAppointmentDto } from '../dto/update-Appointment.dto';
import AppointmentRepository from '../typeorm/repositories/AppointmentRepository';

@Injectable()
export class UpdateAppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    if (!id) {
      throw new HttpException('Id do agendamento não informado', 400);
    }

    const appointment = await this.appointmentRepository.findOne(id);

    if (!appointment) {
      throw new HttpException('Agendamento não encontrado', 404);
    }

    const dataUpdate = {
      ...appointment,
      status: updateAppointmentDto.status,
      schedule_id: appointment.schedule.id,
      patient_id: appointment.patient.id,
    };

    return await this.appointmentRepository.update(id, dataUpdate);
  }
}
