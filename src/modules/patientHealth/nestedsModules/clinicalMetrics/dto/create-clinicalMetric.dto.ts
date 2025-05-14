import { ApiProperty } from '@nestjs/swagger';
import { MetricType } from '../entities/clinicalMetric.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class SourceDto {
  @ApiProperty({
    description: 'The type of the source',
    example: 'FORM_RESPONSE',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'The ID of the source',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The field name in the source',
    example: 'blood_pressure',
  })
  @IsString()
  @IsOptional()
  field?: string;

  @ApiProperty({
    description: 'The session name in the source',
    example: 'Vital Signs',
  })
  @IsString()
  @IsOptional()
  session?: string;
}

class MetadataDto {
  @ApiProperty({
    description: 'The unit of measurement',
    example: 'mmHg',
  })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({
    description: 'Reference range for the metric',
    example: {
      min: 90,
      max: 120,
      criticalMin: 80,
      criticalMax: 180,
    },
  })
  @IsObject()
  @IsOptional()
  referenceRange?: {
    min?: number;
    max?: number;
    criticalMin?: number;
    criticalMax?: number;
  };

  @ApiProperty({
    description: 'Precision for numeric values',
    example: 1,
  })
  @IsOptional()
  precision?: number;

  [key: string]: any;
}

export class CreateClinicalMetricDto {
  @ApiProperty({
    description: 'The attendance ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  attendanceId?: string;

  @ApiProperty({
    enum: MetricType,
    description: 'The type of the clinical metric',
    example: MetricType.VITAL_SIGN,
  })
  @IsEnum(MetricType)
  @IsNotEmpty()
  type: MetricType;

  @ApiProperty({
    description: 'The standardized code',
    example: 'LOINC:85354-9',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'The friendly name of the metric',
    example: 'Blood Pressure',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The value of the metric',
    example: '120/80',
  })
  @IsNotEmpty()
  value: any;

  @ApiProperty({
    type: MetadataDto,
    description: 'Additional metadata for the metric',
  })
  @IsObject()
  @IsOptional()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @ApiProperty({
    type: SourceDto,
    description: 'Source information',
  })
  @IsObject()
  @IsOptional()
  @Type(() => SourceDto)
  source?: SourceDto;

  @ApiProperty({
    description: 'The ID of the form response',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  patientId: string;

  @ApiProperty({
    description: 'The ID of the professional',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  professionalId?: string;
}
