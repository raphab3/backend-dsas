import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AttendanceStatusEnum } from '../types';

export class UpdateStatusAttendanceDto {
  @ApiProperty({
    description: 'New attendance status',
    enum: AttendanceStatusEnum,
    example: AttendanceStatusEnum.PAUSED,
  })
  @IsEnum(AttendanceStatusEnum)
  status: AttendanceStatusEnum;
}
