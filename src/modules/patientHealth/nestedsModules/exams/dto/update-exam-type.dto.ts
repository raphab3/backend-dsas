import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ExamCategoryEnum } from '../entities/exam-type.entity';

export class UpdateExamTypeDto {
  @ApiProperty({
    description: 'Nome do tipo de exame',
    example: 'Hemograma Completo',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Categoria do exame',
    enum: ExamCategoryEnum,
    example: ExamCategoryEnum.LABORATORY,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExamCategoryEnum)
  category?: ExamCategoryEnum;

  @ApiProperty({
    description: 'Descrição do tipo de exame',
    example: 'Exame de sangue que avalia as células sanguíneas',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Status de ativação do tipo de exame',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
