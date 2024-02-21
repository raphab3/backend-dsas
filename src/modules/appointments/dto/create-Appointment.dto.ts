import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Schedule of the appointment',
    type: 'string',
    example: 'uuid',
  })
  schedule_id: string;

  @ApiProperty({
    description: 'Matricula of the personSig',
    type: 'string',
    example: '123456',
  })
  matricula: string;

  @ApiProperty({
    description: 'Dependent id',
    type: 'string',
    example: 'uuid',
  })
  dependent_id: string;
}
