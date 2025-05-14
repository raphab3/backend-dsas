import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Repository } from 'typeorm';
import { VitalSigns } from '../entities/VitalSigns.entity';
import { QueryVitalSignsDto } from '../dto/query-VitalSign.dto';

@Injectable()
export class FindAllVitalSignsService {
  constructor(
    @InjectRepository(VitalSigns)
    private VitalSignsRepository: Repository<VitalSigns>,
  ) {}

  async execute(
    query: QueryVitalSignsDto,
  ): Promise<IPaginatedResult<VitalSigns> | VitalSigns> {
    let page = 1;
    let perPage = 10;

    // Criar query builder com joins necessários
    const queryBuilder = this.VitalSignsRepository.createQueryBuilder(
      'vital_signs',
    )
      .leftJoinAndSelect('vital_signs.patient', 'patient')
      .leftJoinAndSelect('vital_signs.attendance', 'attendance')
      .leftJoinAndSelect('vital_signs.registeredBy', 'registeredBy')
      .orderBy('vital_signs.createdAt', 'DESC');

    // Aplicar filtros
    let whereApplied = false;

    if (query.id) {
      queryBuilder.where('vital_signs.id = :id', { id: query.id });
      whereApplied = true;
    }

    if (query.patientId) {
      if (whereApplied) {
        queryBuilder.andWhere('patient.id = :patientId', {
          patientId: query.patientId,
        });
      } else {
        queryBuilder.where('patient.id = :patientId', {
          patientId: query.patientId,
        });
        whereApplied = true;
      }
    }

    if (query.attendanceId) {
      if (whereApplied) {
        queryBuilder.andWhere('attendance.id = :attendanceId', {
          attendanceId: query.attendanceId,
        });
      } else {
        queryBuilder.where('attendance.id = :attendanceId', {
          attendanceId: query.attendanceId,
        });
        whereApplied = true;
      }
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(queryBuilder, {
      page,
      perPage,
    });

    console.log('result', result);

    return result;
  }
}
