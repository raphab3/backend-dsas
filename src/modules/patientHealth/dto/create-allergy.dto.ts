import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AllergySeverity } from '../entities/allergy.entity';

export class CreateAllergyDto {
  @ApiProperty({
    description: 'ID do paciente',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    description: 'Nome do alérgeno',
    type: 'string',
    example: 'Penicilina',
  })
  @IsString()
  @IsNotEmpty()
  allergen: string;

  @ApiProperty({
    description: 'Gravidade da alergia',
    enum: AllergySeverity,
    default: AllergySeverity.UNKNOWN,
  })
  @IsEnum(AllergySeverity)
  @IsOptional()
  severity?: AllergySeverity;

  @ApiProperty({
    description: 'Descrição da reação alérgica',
    type: 'string',
    example: 'Urticária e inchaço',
    required: false,
  })
  @IsString()
  @IsOptional()
  reaction?: string;

  @ApiProperty({
    description: 'ID do atendimento onde a alergia foi reportada',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  attendanceId?: string;

  @ApiProperty({
    description: 'ID do profissional que registrou a alergia',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  professionalId?: string;
}
