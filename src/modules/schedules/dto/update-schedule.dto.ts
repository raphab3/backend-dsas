import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @ApiProperty({
    description: 'Available date of the schedule',
    type: 'string',
    example: '2021-01-01',
  })
  available_date: string;

  @ApiProperty({
    description: 'Start time of the schedule',
    type: 'string',
    example: '08:00',
  })
  start_time: string;

  @ApiProperty({
    description: 'End time of the schedule',
    type: 'string',
    example: '09:00',
  })
  end_time: string;

  @ApiProperty({
    description: 'Max patients of the schedule',
    type: 'number',
    example: 10,
  })
  max_patients: number;

  @ApiProperty({
    description: 'Professional of the schedule',
    type: 'string',
    example: 'uuid',
  })
  professional_id: string;

  @ApiProperty({
    description: 'Specialty of the schedule',
    type: 'string',
    example: 'uuid',
  })
  specialty_id: string;

  @ApiProperty({
    description: 'Location of the schedule',
    type: 'string',
    example: 'uuid',
  })
  location_id: string;

  @ApiProperty({
    description: 'Trainee of the schedule',
    type: 'string',
    example: 'uuid',
  })
  @IsOptional()
  trainee_id?: string;
}
