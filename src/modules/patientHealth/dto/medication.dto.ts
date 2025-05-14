import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MedicationFrequency, MedicationStatus } from '../entities/medication.entity';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Patient ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'Medication name',
    example: 'Paracetamol',
  })
  @IsString()
  medicationName: string;

  @ApiProperty({
    description: 'Medication dosage',
    example: '500mg',
    required: false,
  })
  @IsString()
  @IsOptional()
  dosage?: string;

  @ApiProperty({
    description: 'Medication frequency',
    enum: MedicationFrequency,
    example: MedicationFrequency.TWICE_DAILY,
    required: false,
  })
  @IsEnum(MedicationFrequency)
  @IsOptional()
  frequency?: MedicationFrequency;

  @ApiProperty({
    description: 'Medication route',
    example: 'Oral',
    required: false,
  })
  @IsString()
  @IsOptional()
  route?: string;

  @ApiProperty({
    description: 'Medication instructions',
    example: 'Take with food',
    required: false,
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({
    description: 'Medication status',
    enum: MedicationStatus,
    example: MedicationStatus.ACTIVE,
    required: false,
  })
  @IsEnum(MedicationStatus)
  @IsOptional()
  status?: MedicationStatus;

  @ApiProperty({
    description: 'Medication start date',
    example: '2023-01-01',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'Medication end date',
    example: '2023-12-31',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Is medication active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Attendance ID where medication was reported',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  attendanceId?: string;

  @ApiProperty({
    description: 'Professional ID who prescribed the medication',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  professionalId?: string;
}

export class UpdateMedicationDto {
  @ApiProperty({
    description: 'Medication name',
    example: 'Paracetamol',
    required: false,
  })
  @IsString()
  @IsOptional()
  medicationName?: string;

  @ApiProperty({
    description: 'Medication dosage',
    example: '500mg',
    required: false,
  })
  @IsString()
  @IsOptional()
  dosage?: string;

  @ApiProperty({
    description: 'Medication frequency',
    enum: MedicationFrequency,
    example: MedicationFrequency.TWICE_DAILY,
    required: false,
  })
  @IsEnum(MedicationFrequency)
  @IsOptional()
  frequency?: MedicationFrequency;

  @ApiProperty({
    description: 'Medication route',
    example: 'Oral',
    required: false,
  })
  @IsString()
  @IsOptional()
  route?: string;

  @ApiProperty({
    description: 'Medication instructions',
    example: 'Take with food',
    required: false,
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({
    description: 'Medication status',
    enum: MedicationStatus,
    example: MedicationStatus.ACTIVE,
    required: false,
  })
  @IsEnum(MedicationStatus)
  @IsOptional()
  status?: MedicationStatus;

  @ApiProperty({
    description: 'Medication start date',
    example: '2023-01-01',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'Medication end date',
    example: '2023-12-31',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Is medication active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
