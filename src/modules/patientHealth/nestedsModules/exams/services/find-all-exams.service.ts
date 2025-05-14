import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';

@Injectable()
export class FindAllExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
  ) {}

  async execute(): Promise<Exam[]> {
    return this.examRepository.find({
      relations: ['examType', 'professional', 'patient', 'attendance'],
      order: { requestDate: 'DESC' },
    });
  }
}
