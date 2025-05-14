import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';

@Injectable()
export class FindExamsByPatientService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
  ) {}

  async execute(patientId: string): Promise<Exam[]> {
    return this.examRepository.find({
      where: { patient: { id: patientId } },
      relations: ['examType', 'professional', 'attendance'],
      order: { requestDate: 'DESC' },
    });
  }
}
