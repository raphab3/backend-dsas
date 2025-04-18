import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { AttendanceStatusEnum } from '@modules/attendances/types';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAttendanceStatsResponse } from '../interfaces/IResponseStats';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetAttendanceStatsDto } from '../dto/getAttendanceStats.dto';
import env from '@config/env';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class GetAttendanceStatsService {
  private readonly CACHE_TTL = 3600;
  private isCacheEnabled: boolean = env.NODE_ENV === 'production';
  private readonly logger = new Logger(GetAttendanceStatsService.name);

  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(
    query: GetAttendanceStatsDto,
  ): Promise<IAttendanceStatsResponse> {
    const cacheKey = this.generateCacheKey(query);
    if (this.isCacheEnabled) {
      try {
        const cachedResult = await this.getCachedResult(cacheKey);
        if (cachedResult) {
          return cachedResult;
        }
      } catch (error) {
        this.logger.error(
          `Error retrieving cache: ${error.message}`,
          error.stack,
        );
      }
    }

    const stats = await this.generateStats(query);

    if (this.isCacheEnabled) {
      try {
        await this.setCachedResult(cacheKey, stats);
      } catch (error) {
        this.logger.error(`Error setting cache: ${error.message}`, error.stack);
      }
    }

    return stats;
  }

  private generateCacheKey(query: GetAttendanceStatsDto): string {
    return `attendance_stats_${JSON.stringify(query)}`;
  }

  private async getCachedResult(
    key: string,
  ): Promise<IAttendanceStatsResponse | null> {
    try {
      return await this.cacheManager.get<IAttendanceStatsResponse>(key);
    } catch (error) {
      this.logger.error('Cache retrieval error:', error);
      return null;
    }
  }

  private async setCachedResult(
    key: string,
    value: IAttendanceStatsResponse,
  ): Promise<void> {
    try {
      await this.cacheManager.set(key, value, this.CACHE_TTL);
    } catch (error) {
      this.logger.error('Cache setting error:', error);
    }
  }

  private async generateStats(
    query: GetAttendanceStatsDto,
  ): Promise<IAttendanceStatsResponse> {
    const { startDate, endDate, locationId, professionalId, specialtyId } =
      this.getFilterParams(query);

    // Get attendance data
    const attendanceData = await this.getAttendanceData(
      startDate,
      endDate,
      locationId,
      professionalId,
      specialtyId,
    );

    // Extract IDs for related entities
    const patientIds = this.extractPatientIds(attendanceData);
    const professionalIds = this.extractProfessionalIds(attendanceData);

    // Get related data
    const [professionalData, patientData] = await Promise.all([
      this.getProfessionalData(professionalIds, locationId),
      this.getPatientData(patientIds),
    ]);

    // Calculate stats
    const result = {
      attendances: this.getAttendanceStats(attendanceData),
      professionals: this.getProfessionalStats(
        professionalData,
        attendanceData,
      ),
      patients: this.getPatientStats(patientData, attendanceData),
    };

    return result;
  }

  private getFilterParams(query: GetAttendanceStatsDto): {
    startDate: string;
    endDate: string;
    locationId?: string;
    professionalId?: string;
    specialtyId?: string;
  } {
    const { startDate, endDate } = this.getDateRange(query);
    return {
      startDate,
      endDate,
      locationId: query.locationId,
      professionalId: query.professionalId,
      specialtyId: query.specialtyId,
    };
  }

  private extractPatientIds(attendances: Attendance[]): string[] {
    return [
      ...new Set(
        attendances.map((attendance) => attendance.patient?.id).filter(Boolean),
      ),
    ];
  }

  private extractProfessionalIds(attendances: Attendance[]): string[] {
    return [
      ...new Set(
        attendances
          .map((attendance) => attendance.professional?.id)
          .filter(Boolean),
      ),
    ];
  }

  private getDateRange(query: GetAttendanceStatsDto): {
    startDate: string;
    endDate: string;
  } {
    let startDate: string;
    let endDate: string;

    if (query.startDate && query.endDate) {
      startDate = query.startDate;
      endDate = query.endDate;
    } else {
      const today = new Date();
      const currentYear = today.getFullYear();
      startDate = `${currentYear}-01-01`;
      endDate = `${currentYear}-12-31`;
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('Invalid date range');
    }

    return { startDate, endDate };
  }

  private async getAttendanceData(
    startDate: string,
    endDate: string,
    locationId?: string,
    professionalId?: string,
    specialtyId?: string,
  ): Promise<Attendance[]> {
    let query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.patient', 'patient')
      .leftJoinAndSelect('attendance.professional', 'professional')
      .leftJoinAndSelect('professional.person_sig', 'professional_person_sig')
      .leftJoinAndSelect('attendance.location', 'location')
      .leftJoinAndSelect('attendance.specialty', 'specialty')
      .leftJoinAndSelect('patient.person_sig', 'patient_person_sig')
      .where('attendance.startAttendance BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .select([
        'attendance.id',
        'attendance.status',
        'attendance.startAttendance',
        'attendance.endAttendance',
        'patient.id',
        'patient_person_sig.nome',
        'professional.id',
        'professional_person_sig.nome',
        'location.id',
        'location.name',
        'location.city',
        'specialty.id',
        'specialty.name',
      ]);

    if (locationId) {
      query = query.andWhere('location.id = :locationId', { locationId });
    }

    if (professionalId) {
      query = query.andWhere('professional.id = :professionalId', {
        professionalId,
      });
    }

    if (specialtyId) {
      query = query.andWhere('specialty.id = :specialtyId', { specialtyId });
    }

    const result = await query.cache(true).getMany();

    return result;
  }

  private async getProfessionalData(
    professionalIds?: string[],
    locationId?: string,
  ): Promise<Professional[]> {
    const queryBuilder = this.professionalRepository
      .createQueryBuilder('professional')
      .leftJoinAndSelect('professional.locations', 'locations')
      .leftJoinAndSelect('professional.person_sig', 'person_sig');

    // Add filters
    if (professionalIds && professionalIds.length > 0) {
      queryBuilder.andWhere('professional.id IN (:...professionalIds)', {
        professionalIds,
      });
    }

    if (locationId) {
      queryBuilder.andWhere('locations.id = :locationId', { locationId });
    }

    return queryBuilder.cache(true).getMany();
  }

  private async getPatientData(patientIds?: string[]): Promise<Patient[]> {
    if (patientIds && patientIds.length > 0) {
      return this.patientRepository
        .createQueryBuilder('patient')
        .leftJoinAndSelect('patient.person_sig', 'person_sig')
        .where('patient.id IN (:...patientIds)', { patientIds })
        .getMany();
    }

    return [];
  }

  private getAttendanceStats(attendances: Attendance[]): any {
    const byStatus = this.calculateTotalsByStatus(attendances);
    const averageDuration = this.calculateAverageDuration(attendances);

    return {
      total: attendances.length,
      monthly: this.aggregateAttendancesByMonth(attendances),
      byStatus,
      byStatusByMonth: this.calculateTotalByStatusByMonth(attendances),
      byLocation: this.aggregateAttendancesByLocation(attendances),
      bySpecialty: this.aggregateAttendancesBySpecialty(attendances),
      averageDuration,
    };
  }

  private getProfessionalStats(
    professionals: Professional[],
    attendances: Attendance[],
  ): any {
    return {
      total: professionals.length,
      byAttendanceCount:
        this.calculateProfessionalAttendanceCounts(attendances),
      byLocation: this.groupProfessionalsByLocation(professionals),
    };
  }

  private getPatientStats(patients: Patient[], attendances: Attendance[]): any {
    return {
      total: patients.length,
      byAttendanceCount: this.calculatePatientAttendanceCounts(attendances),
    };
  }

  private aggregateAttendancesByMonth(
    attendances: Attendance[],
  ): Record<string, number> {
    const aggregated = attendances.reduce(
      (acc, attendance) => {
        const attendanceDate = new Date(attendance.startAttendance);
        const monthYearKey = `${attendanceDate.getFullYear()}-${(attendanceDate.getMonth() + 1).toString().padStart(2, '0')}`;
        acc[monthYearKey] = (acc[monthYearKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.fromEntries(
      Object.entries(aggregated).sort(([a], [b]) => a.localeCompare(b)),
    );
  }

  private calculateTotalsByStatus(
    attendances: Attendance[],
  ): Record<AttendanceStatusEnum, number> {
    const result = {
      [AttendanceStatusEnum.IN_PROGRESS]: 0,
      [AttendanceStatusEnum.COMPLETED]: 0,
      [AttendanceStatusEnum.CANCELED]: 0,
      [AttendanceStatusEnum.PAUSED]: 0,
    };

    attendances.forEach((attendance) => {
      result[attendance.status] = (result[attendance.status] || 0) + 1;
    });

    return result;
  }

  private calculateTotalByStatusByMonth(
    attendances: Attendance[],
  ): Record<string, Record<AttendanceStatusEnum, number>> {
    return attendances.reduce(
      (acc, attendance) => {
        const attendanceDate = new Date(attendance.startAttendance);
        const monthYearKey = `${attendanceDate.getFullYear()}-${(
          attendanceDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}`;

        if (!acc[monthYearKey]) {
          acc[monthYearKey] = {
            [AttendanceStatusEnum.IN_PROGRESS]: 0,
            [AttendanceStatusEnum.COMPLETED]: 0,
            [AttendanceStatusEnum.CANCELED]: 0,
            [AttendanceStatusEnum.PAUSED]: 0,
          };
        }

        acc[monthYearKey][attendance.status]++;
        return acc;
      },
      {} as Record<string, Record<AttendanceStatusEnum, number>>,
    );
  }

  private aggregateAttendancesByLocation(
    attendances: Attendance[],
  ): Record<string, Record<string, number>> {
    const aggregated = attendances.reduce(
      (acc, attendance) => {
        if (!attendance.location) return acc;

        const locationName = `${attendance.location.name} - ${attendance.location.city}`;

        if (!acc[locationName]) {
          acc[locationName] = {
            inProgress: 0,
            completed: 0,
            canceled: 0,
            paused: 0,
            total: 0,
          };
        }

        switch (attendance.status) {
          case AttendanceStatusEnum.IN_PROGRESS:
            acc[locationName].inProgress++;
            break;
          case AttendanceStatusEnum.COMPLETED:
            acc[locationName].completed++;
            break;
          case AttendanceStatusEnum.CANCELED:
            acc[locationName].canceled++;
            break;
          case AttendanceStatusEnum.PAUSED:
            acc[locationName].paused++;
            break;
        }

        acc[locationName].total++;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );

    return Object.fromEntries(
      Object.entries(aggregated).sort(([, a], [, b]) => b.total - a.total),
    );
  }

  private aggregateAttendancesBySpecialty(
    attendances: Attendance[],
  ): Record<string, Record<string, number>> {
    const aggregated = attendances.reduce(
      (acc, attendance) => {
        if (!attendance.specialty) return acc;

        const specialtyName = attendance.specialty.name;

        if (!acc[specialtyName]) {
          acc[specialtyName] = {
            inProgress: 0,
            completed: 0,
            canceled: 0,
            paused: 0,
            total: 0,
          };
        }

        switch (attendance.status) {
          case AttendanceStatusEnum.IN_PROGRESS:
            acc[specialtyName].inProgress++;
            break;
          case AttendanceStatusEnum.COMPLETED:
            acc[specialtyName].completed++;
            break;
          case AttendanceStatusEnum.CANCELED:
            acc[specialtyName].canceled++;
            break;
          case AttendanceStatusEnum.PAUSED:
            acc[specialtyName].paused++;
            break;
        }

        acc[specialtyName].total++;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );

    return Object.fromEntries(
      Object.entries(aggregated).sort(([, a], [, b]) => b.total - a.total),
    );
  }

  private calculateAverageDuration(attendances: Attendance[]): number {
    const completedAttendances = attendances.filter(
      (attendance) =>
        attendance.status === AttendanceStatusEnum.COMPLETED &&
        attendance.startAttendance &&
        attendance.endAttendance,
    );

    if (completedAttendances.length === 0) {
      return 0;
    }

    const totalDuration = completedAttendances.reduce((total, attendance) => {
      const duration = differenceInMinutes(
        new Date(attendance.endAttendance),
        new Date(attendance.startAttendance),
      );
      return total + duration;
    }, 0);

    return Math.round(totalDuration / completedAttendances.length);
  }

  private calculateProfessionalAttendanceCounts(
    attendances: Attendance[],
  ): Record<string, number> {
    const counts = attendances.reduce(
      (acc, attendance) => {
        if (!attendance.professional?.person_sig?.nome) return acc;

        const professionalName = attendance.professional.person_sig.nome;
        acc[professionalName] = (acc[professionalName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Sort by count (descending) and limit to top 10
    return Object.fromEntries(
      Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
    );
  }

  private calculatePatientAttendanceCounts(
    attendances: Attendance[],
  ): Record<string, number> {
    const counts = attendances.reduce(
      (acc, attendance) => {
        if (!attendance.patient?.person_sig?.nome) return acc;

        const patientName = attendance.patient.person_sig.nome;
        acc[patientName] = (acc[patientName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Sort by count (descending) and limit to top 10
    return Object.fromEntries(
      Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
    );
  }

  private groupProfessionalsByLocation(
    professionals: Professional[],
  ): Record<
    string,
    { professionals: Array<{ id: string; name: string }>; total: number }
  > {
    const aggregated = professionals.reduce(
      (acc, professional) => {
        professional.locations.forEach((location) => {
          const locationName = location.name;
          if (!acc[locationName]) {
            acc[locationName] = { professionals: [], total: 0 };
          }
          acc[locationName].professionals.push({
            id: professional.id,
            name: professional.person_sig.nome,
          });
          acc[locationName].total++;
        });
        return acc;
      },
      {} as Record<
        string,
        { professionals: Array<{ id: string; name: string }>; total: number }
      >,
    );

    return Object.fromEntries(
      Object.entries(aggregated).sort(([, a], [, b]) => b.total - a.total),
    );
  }
}
