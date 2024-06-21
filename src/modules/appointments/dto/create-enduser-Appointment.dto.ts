import { ApiProperty } from '@nestjs/swagger';

export class CreateEndUserAppointmentDto {
  @ApiProperty({
    description: 'Schedule of the appointment',
    type: 'string',
  })
  schedule_id: string;

  @ApiProperty({
    description: 'uuid of the personSig',
    type: 'string',
  })
  person_sig_id: string;

  @ApiProperty({
    description: 'Dependent id',
    type: 'string',
  })
  dependent_id: string;
}
