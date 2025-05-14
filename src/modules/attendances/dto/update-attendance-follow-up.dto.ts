import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAttendanceFollowUpDto {
  @ApiProperty({
    description: 'Mark if the attendance needs a follow-up',
    type: 'boolean',
    example: true,
  })
  @IsBoolean()
  needsFollowUp: boolean;
}
