import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';

@Injectable()
export class FindOnePatientRecordService {
  constructor(
    @InjectRepository(PatientRecord)
    private patientRecordRepository: Repository<PatientRecord>,
  ) {}

  async execute(id: string): Promise<PatientRecord> {
    const patientRecord = await this.patientRecordRepository.findOne({
      where: { id },
    });

    if (!patientRecord) {
      throw new HttpException('PatientRecord não encontrado', 404);
    }

    return patientRecord;
  }
}
