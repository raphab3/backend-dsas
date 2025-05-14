import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ExamCategoryEnum } from '../entities/exam-type.entity';

export class CreateExamTypeDto {
  @ApiProperty({
    description: 'Nome do tipo de exame',
    example: 'Hemograma Completo',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Categoria do exame',
    enum: ExamCategoryEnum,
    example: ExamCategoryEnum.LABORATORY,
  })
  @IsEnum(ExamCategoryEnum)
  category: ExamCategoryEnum;

  @ApiProperty({
    description: 'Descrição do tipo de exame',
    example: 'Exame de sangue que avalia as células sanguíneas',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
