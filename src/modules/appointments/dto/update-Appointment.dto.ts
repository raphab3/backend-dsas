import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-Appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  schedule_id?: string;
}
