import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StartAttendanceDto {
  @ApiProperty({
    description: 'Patient ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  patientId: string;

  @ApiProperty({
    description: 'Professional ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  professionalId: string;

  @ApiProperty({
    description: 'Group Form Template ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  groupFormTemplateId: string;

  @ApiProperty({
    description: 'Appointment ID',
    type: 'string',
  })
  @IsOptional()
  appointmentId?: string;
}
