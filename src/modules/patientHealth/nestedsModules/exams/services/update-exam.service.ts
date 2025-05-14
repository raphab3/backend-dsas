import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';
import { ExamType } from '../entities/exam-type.entity';
import { UpdateExamDto } from '../dto/update-exam.dto';

@Injectable()
export class UpdateExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  async execute(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['examType'],
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado');
    }

    // Update exam type if provided
    if (updateExamDto.examTypeId) {
      const examType = await this.examTypeRepository.findOne({
        where: { id: updateExamDto.examTypeId },
      });

      if (!examType) {
        throw new NotFoundException('Tipo de exame não encontrado');
      }

      exam.examType = examType;
    }

    // Update other fields if provided
    if (updateExamDto.instructions !== undefined) {
      exam.instructions = updateExamDto.instructions;
    }

    if (updateExamDto.status !== undefined) {
      exam.status = updateExamDto.status;
    }

    if (updateExamDto.results !== undefined) {
      exam.results = updateExamDto.results;
    }

    if (updateExamDto.resultsDate !== undefined) {
      exam.resultsDate = new Date(updateExamDto.resultsDate);
    }

    return this.examRepository.save(exam);
  }
}
