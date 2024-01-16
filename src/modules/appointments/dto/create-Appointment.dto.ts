import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Schedule of the appointment',
    type: 'string',
    example: 'uuid',
  })
  schedule_id: string;

  @ApiProperty({
    description: 'Patient of the appointment',
    type: 'string',
    example: 'uuid',
  })
  patient_id: string;
}
