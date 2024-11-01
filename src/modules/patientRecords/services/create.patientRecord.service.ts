import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';
import { Repository } from 'typeorm';
import { CreatePatientRecordDto } from '../dto/create-patientRecord.dto';

@Injectable()
export class CreatePatientRecordService {
  constructor(
    @InjectRepository(PatientRecord)
    private patientRecordRepository: Repository<PatientRecord>,
  ) {}

  async execute(createPatientRecordDto: CreatePatientRecordDto) {
    const createPatientRecord = this.patientRecordRepository.create(
      createPatientRecordDto,
    );
    const patientRecordSaved =
      await this.patientRecordRepository.save(createPatientRecord);

    return patientRecordSaved;
  }
}
