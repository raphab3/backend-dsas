import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Repository } from 'typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';
import { QueryPatientRecordDto } from '../dto/query-patientRecord.dto';

@Injectable()
export class FindAllPatientRecordService {
  constructor(
    @InjectRepository(PatientRecord)
    private patientRecordRepository: Repository<PatientRecord>,
  ) {}

  async execute(
    query: QueryPatientRecordDto,
  ): Promise<IPaginatedResult<PatientRecord>> {
    let page = 1;
    let perPage = 10;

    const patientRecordCreateQueryBuilder = this.patientRecordRepository
      .createQueryBuilder('patientRecords')
      .orderBy('patientRecords.created_at', 'DESC');

    if (query.id) {
      patientRecordCreateQueryBuilder.where('patientRecords.id = :id', {
        id: query.id,
      });
    }

    if (query.name) {
      patientRecordCreateQueryBuilder.where('patientRecords.name ILike :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      patientRecordCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }
}
