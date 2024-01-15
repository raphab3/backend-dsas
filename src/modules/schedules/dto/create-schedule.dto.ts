import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
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
}
