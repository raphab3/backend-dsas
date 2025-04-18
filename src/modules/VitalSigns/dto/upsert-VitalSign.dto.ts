import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  IsObject,
} from 'class-validator';

export class UpsertVitalSignsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  attendanceId: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  systolicPressure?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  diastolicPressure?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  oxygenSaturation?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  bloodGlucose?: number;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  metadata?: {
    measurementConditions?: string;
    equipmentUsed?: string;
    notes?: string;
    position?: 'SITTING' | 'STANDING' | 'LYING';
    [key: string]: any;
  };
}
