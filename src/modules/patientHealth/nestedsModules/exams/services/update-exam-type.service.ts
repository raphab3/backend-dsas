import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamType } from '../entities/exam-type.entity';
import { UpdateExamTypeDto } from '../dto/update-exam-type.dto';

@Injectable()
export class UpdateExamTypeService {
  constructor(
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  async execute(
    id: string,
    updateExamTypeDto: UpdateExamTypeDto,
  ): Promise<ExamType> {
    const examType = await this.examTypeRepository.findOne({
      where: { id },
    });

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado');
    }

    // Update fields
    if (updateExamTypeDto.name !== undefined) {
      examType.name = updateExamTypeDto.name;
    }

    if (updateExamTypeDto.category !== undefined) {
      examType.category = updateExamTypeDto.category;
    }

    if (updateExamTypeDto.description !== undefined) {
      examType.description = updateExamTypeDto.description;
    }

    if (updateExamTypeDto.active !== undefined) {
      examType.active = updateExamTypeDto.active;
    }

    return this.examTypeRepository.save(examType);
  }
}
