import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExamDto {
  @ApiProperty({
    description: 'ID do atendimento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  attendanceId: string;

  @ApiProperty({
    description: 'ID do paciente',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'ID do profissional',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsUUID()
  professionalId: string;

  @ApiProperty({
    description: 'ID do tipo de exame',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @IsNotEmpty()
  @IsUUID()
  examTypeId: string;

  @ApiProperty({
    description: 'Data da solicitação do exame',
    example: '2023-01-15',
  })
  @IsNotEmpty()
  @IsDateString()
  requestDate: string;

  @ApiProperty({
    description: 'Instruções para o exame',
    example: 'Jejum de 8 horas',
    required: false,
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}
