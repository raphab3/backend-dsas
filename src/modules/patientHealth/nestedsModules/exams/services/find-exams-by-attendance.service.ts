import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';

@Injectable()
export class FindExamsByAttendanceService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
  ) {}

  async execute(attendanceId: string): Promise<Exam[]> {
    return this.examRepository.find({
      where: { attendance: { id: attendanceId } },
      relations: ['examType', 'professional'],
      order: { requestDate: 'DESC' },
    });
  }
}
