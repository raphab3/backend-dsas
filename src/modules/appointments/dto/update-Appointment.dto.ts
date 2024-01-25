import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-Appointment.dto';
import { StatusAppointmentType } from '../interfaces/IAppointment';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiProperty({
    description: 'Status of the appointment',
    type: 'string',
    example: 'scheduled | canceled | missed | attended',
  })
  status: StatusAppointmentType = 'scheduled';
}
