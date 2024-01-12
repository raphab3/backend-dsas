import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'The name of the schedule',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
