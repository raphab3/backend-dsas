import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamType } from '../entities/exam-type.entity';

@Injectable()
export class FindAllExamTypesService {
  constructor(
    @InjectRepository(ExamType)
    private examTypeRepository: Repository<ExamType>,
  ) {}

  async execute(activeOnly: boolean = false): Promise<ExamType[]> {
    const query = this.examTypeRepository.createQueryBuilder('examType');

    if (activeOnly) {
      query.where('examType.active = :active', { active: true });
    }

    query.orderBy('examType.name', 'ASC');

    return query.getMany();
  }
}
