import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum VitalSignMetric {
  TEMPERATURE = 'temperature',
  BLOOD_PRESSURE = 'bloodPressure',
  HEART_RATE = 'heartRate',
  WEIGHT = 'weight',
  HEIGHT = 'height',
  BMI = 'bmi',
}

export class QueryVitalSignsHistoryDto {
  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ enum: VitalSignMetric })
  @IsOptional()
  @IsEnum(VitalSignMetric)
  metric?: VitalSignMetric;
}
