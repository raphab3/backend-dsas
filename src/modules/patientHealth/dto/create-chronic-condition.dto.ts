import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ConditionStatus } from '../entities/chronicCondition.entity';

export class CreateChronicConditionDto {
  @ApiProperty({
    description: 'ID do paciente',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({
    description: 'Nome da condição crônica',
    type: 'string',
    example: 'Diabetes Tipo 2',
  })
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty({
    description: 'Status da condição',
    enum: ConditionStatus,
    default: ConditionStatus.ACTIVE,
  })
  @IsEnum(ConditionStatus)
  @IsOptional()
  status?: ConditionStatus;

  @ApiProperty({
    description: 'Observações sobre a condição',
    type: 'string',
    example: 'Controlada com medicação',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Data do diagnóstico',
    type: 'string',
    format: 'date',
    example: '2023-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  diagnosedAt?: string;

  @ApiProperty({
    description: 'ID do atendimento onde a condição foi reportada',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  attendanceId?: string;

  @ApiProperty({
    description: 'ID do profissional que registrou a condição',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  professionalId?: string;
}
