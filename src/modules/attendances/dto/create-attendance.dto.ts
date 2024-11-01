import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'The name of the attendance',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
