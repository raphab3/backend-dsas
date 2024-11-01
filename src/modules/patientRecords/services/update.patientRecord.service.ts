import { HttpException, Injectable } from '@nestjs/common';
import { UpdatePatientRecordDto } from '../dto/update-patientRecord.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdatePatientRecordService {
  constructor(
    @InjectRepository(PatientRecord)
    private patientRecordRepository: Repository<PatientRecord>,
  ) {}

  async update(
    id: string,
    updatePatientRecordDto: UpdatePatientRecordDto,
  ): Promise<void> {
    const patientRecord = await this.patientRecordRepository.findOne({
      where: { id },
    });

    if (!patientRecord) {
      throw new HttpException('PatientRecord não encontrado', 404);
    }

    await this.patientRecordRepository.update(id, updatePatientRecordDto);
  }
}
