import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VitalSigns } from '../entities/VitalSigns.entity';
import { VitalSignMetric } from '../dto/query-VitalSignsHistory.dto';

@Injectable()
export class GetVitalSignsHistoryService {
  constructor(
    @InjectRepository(VitalSigns)
    private vitalSignsRepository: Repository<VitalSigns>,
  ) {}

  async execute(
    patientId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      metric?: VitalSignMetric;
    },
  ) {
    const query = this.vitalSignsRepository
      .createQueryBuilder('vital_signs')
      .where('vital_signs.patient.id = :patientId', { patientId })
      .leftJoinAndSelect('vital_signs.attendance', 'attendance')
      .leftJoinAndSelect('vital_signs.professional', 'professional')
      .orderBy('vital_signs.measuredAt', 'DESC');

    if (options?.startDate) {
      query.andWhere('vital_signs.measuredAt >= :startDate', {
        startDate: options.startDate,
      });
    }

    if (options?.endDate) {
      query.andWhere('vital_signs.measuredAt <= :endDate', {
        endDate: options.endDate,
      });
    }

    return query.getMany();
  }

  async executeByAttendance(attendanceId: string) {
    return this.vitalSignsRepository
      .createQueryBuilder('vital_signs')
      .where('vital_signs.attendance.id = :attendanceId', { attendanceId })
      .leftJoinAndSelect('vital_signs.professional', 'professional')
      .orderBy('vital_signs.measuredAt', 'DESC')
      .getMany();
  }
}
