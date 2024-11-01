import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsUUID,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecordTypeEnum } from '../types';

class MetadataDto {
  [key: string]: any;
}

export class CreatePatientRecordDto {
  @ApiProperty({
    description: 'The type of the patient record',
    enum: RecordTypeEnum,
    example: RecordTypeEnum.CONSULTATION,
  })
  @IsEnum(RecordTypeEnum)
  recordType: RecordTypeEnum;

  @ApiProperty({
    description: 'Additional notes for the patient record',
    type: 'string',
    required: false,
    example: 'Patient reported feeling better after treatment.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Array of form response IDs associated with this record',
    type: 'array',
    items: { type: 'string' },
    required: false,
    example: ['uuid1', 'uuid2'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  formResponseIds?: string[];

  @ApiProperty({
    description: 'Additional metadata for the patient record',
    type: 'object',
    required: false,
    example: { diagnosis: 'Common cold', severity: 'Mild' },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MetadataDto)
  @IsOptional()
  metadata?: MetadataDto;

  @ApiProperty({
    description: 'The UUID of the patient associated with this record',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'The UUID of the professional creating this record',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  professionalId: string;

  @ApiProperty({
    description: 'The UUID of the attendance associated with this record',
    type: 'string',
    format: 'uuid',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsOptional()
  attendanceId?: string;
}
