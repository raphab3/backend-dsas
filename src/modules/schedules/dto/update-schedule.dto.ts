import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  available_date?: string;
  start_time?: string;
  end_time?: string;
  max_patients?: number;
  patients_attended?: number;
}
