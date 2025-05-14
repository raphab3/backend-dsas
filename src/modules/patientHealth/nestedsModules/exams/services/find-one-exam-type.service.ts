import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamType } from '../entities/exam-type.entity';

@Injectable()
export class FindOneExamTypeService {
  constructor(
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  async execute(id: string): Promise<ExamType> {
    const examType = await this.examTypeRepository.findOne({
      where: { id },
    });

    if (!examType) {
      throw new NotFoundException('Tipo de exame não encontrado');
    }

    return examType;
  }
}
