import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamType } from '../entities/exam-type.entity';
import { CreateExamTypeDto } from '../dto/create-exam-type.dto';

@Injectable()
export class CreateExamTypeService {
  constructor(
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  async execute(createExamTypeDto: CreateExamTypeDto): Promise<ExamType> {
    const examType = this.examTypeRepository.create(createExamTypeDto);
    return this.examTypeRepository.save(examType);
  }
}
