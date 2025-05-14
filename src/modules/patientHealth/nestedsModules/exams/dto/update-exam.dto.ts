import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ExamStatusEnum } from '../entities/exam.entity';

export class UpdateExamDto {
  @ApiProperty({
    description: 'ID do tipo de exame',
    example: '123e4567-e89b-12d3-a456-426614174003',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  examTypeId?: string;

  @ApiProperty({
    description: 'Instruções para o exame',
    example: 'Jejum de 8 horas',
    required: false,
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({
    description: 'Status do exame',
    enum: ExamStatusEnum,
    example: ExamStatusEnum.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExamStatusEnum)
  status?: ExamStatusEnum;

  @ApiProperty({
    description: 'Resultados do exame',
    example: 'Hemoglobina: 14g/dL, Leucócitos: 7.500/mm³',
    required: false,
  })
  @IsOptional()
  @IsString()
  results?: string;

  @ApiProperty({
    description: 'Data dos resultados',
    example: '2023-01-20',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  resultsDate?: string;
}
