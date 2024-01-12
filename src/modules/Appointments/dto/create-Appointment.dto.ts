import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'The name of the Appointment',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
