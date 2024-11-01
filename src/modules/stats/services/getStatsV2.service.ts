import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponseStats } from '../interfaces/IResponseStats';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { StatisticsGateway } from '../../../shared/gateways/StatisticsGateway';
import { EventsService } from '@shared/events/EventsService';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ImprovedGetStatsDto } from '../dto/getStats.dto';
import env from '@config/env';

@Injectable()
export class GetStatsServiceV2 implements OnModuleInit {
  private updateInProgress = false;
  private updateQueue: (() => void)[] = [];
  private isCacheEnabled: boolean = env.NODE_ENV === 'production';

  constructor(
    private eventsService: EventsService,
    private statsGateway: StatisticsGateway,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(PersonSig)
    private readonly personSigRepository: Repository<PersonSig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  onModuleInit() {
    this.eventsService.on('statsUpdated', async () => {
      if (this.updateInProgress) {
        this.updateQueue.push(() => this.handleStatsUpdate());
      } else {
        await this.handleStatsUpdate();
      }
    });
  }

  private async handleStatsUpdate() {
    this.updateInProgress = true;
    try {
      await this.clearCache();
      this.statsGateway.notifyStatsUpdated();
    } finally {
      this.updateInProgress = false;
      if (this.updateQueue.length > 0) {
        const nextUpdate = this.updateQueue.shift();
        nextUpdate();
      }
    }
  }

  private async clearCache() {
    const keys = await this.cacheManager.store.keys();
    const deletionPromises = keys.map((key) => this.cacheManager.del(key));
    await Promise.all(deletionPromises);
  }

  async execute(query: ImprovedGetStatsDto): Promise<IResponseStats> {
    const cacheKey = `stats_${JSON.stringify(query)}`;
    const cachedResult = await this.cacheManager.get<IResponseStats>(cacheKey);
    if (cachedResult && this.isCacheEnabled) {
      return cachedResult;
    }

    const { startDate, endDate } = this.getDateRange(query);

    const [
      scheduleData,
      appointmentData,
      professionalData,
      patientData,
      personSigData,
    ] = await Promise.all([
      this.getScheduleData(startDate, endDate),
      this.getAppointmentData(startDate, endDate, query.locationId),
      this.getProfessionalData(),
      this.getPatientData(),
      this.getPersonSigData(),
    ]);

    const stats: IResponseStats = {
      schedules: this.getScheduleStats(
        scheduleData.total,
        scheduleData.schedules,
      ),
      appointments: this.getAppointmentStats(appointmentData),
      professionals: this.getProfessionalStats(professionalData),
      patients: { total: patientData.total },
      employees: this.getEmployeeStats(personSigData),
    };

    await this.cacheManager.set(cacheKey, stats, 3600);
    return stats;
  }

  private async getScheduleData(
    startDate: string,
    endDate: string,
  ): Promise<{ total: number; schedules: Schedule[] }> {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.location', 'location')
      .where('schedule.available_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .cache(true)
      .getMany();

    return {
      total: schedules.length,
      schedules,
    };
  }

  private getDateRange(query: ImprovedGetStatsDto): {
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

  private async getAppointmentData(
    startDate: string,
    endDate: string,
    locationId?: string,
  ): Promise<Appointment[]> {
    let query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.schedule', 'schedule')
      .leftJoinAndSelect('schedule.location', 'location')
      .leftJoinAndSelect('schedule.specialty', 'specialty')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.person_sig', 'patient_person_sig')
      .leftJoinAndSelect('patient.dependent', 'dependent')
      .leftJoinAndSelect('dependent.person_sigs', 'dependent_person_sig')
      .leftJoinAndSelect('schedule.professional', 'professional')
      .leftJoinAndSelect('professional.person_sig', 'professional_person_sig')
      .where('schedule.available_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .select([
        'appointment.id',
        'appointment.status',
        'schedule.id',
        'schedule.available_date',
        'location.id',
        'location.name',
        'location.city',
        'specialty.id',
        'specialty.name',
        'patient.id',
        'dependent.id',
      ]);

    if (locationId) {
      query = query.andWhere('location.id = :locationId', { locationId });
    }

    const result = await query.cache(true).getMany();

    return result;
  }

  private async getProfessionalData(): Promise<Professional[]> {
    return this.professionalRepository
      .createQueryBuilder('professional')
      .leftJoinAndSelect('professional.locations', 'locations')
      .leftJoinAndSelect('professional.person_sig', 'person_sig')
      .cache(true)
      .getMany();
  }

  private async getPatientData(): Promise<{ total: number }> {
    const total = await this.patientRepository.count();
    return { total };
  }

  private async getPersonSigData(): Promise<PersonSig[]> {
    return this.personSigRepository.find();
  }

  private getScheduleStats(totalSchedules: number, schedules: Schedule[]): any {
    const monthlySchedules = this.aggregateMonthlySchedules(schedules);
    return {
      total: totalSchedules,
      monthly: monthlySchedules,
      total_vacancies_filled: this.calculateTotalVacanciesFilled(schedules),
      total_vacancies_available:
        this.calculateTotalVacanciesAvailable(schedules),
      schedulesByLocation: this.aggregateSchedulesByLocation(schedules),
    };
  }

  private getAppointmentStats(appointments: Appointment[]): any {
    const totalsByStatus = this.calculateTotalsByStatus(appointments);
    return {
      total: appointments.length,
      monthly: this.aggregateAppointmentsByMonth(appointments),
      totalHolders: appointments.filter((a) => !a?.patient?.dependent?.id)
        .length,
      totalDependents: appointments.filter((a) => !!a?.patient?.dependent?.id)
        .length,
      total_canceled: totalsByStatus['canceled'] || 0,
      total_attended: totalsByStatus['attended'] || 0,
      total_scheduled: totalsByStatus['scheduled'] || 0,
      total_missed: totalsByStatus['missed'] || 0,
      totalByStatusByMonth: this.calculateTotalByStatusByMonth(appointments),
      byLocation: this.aggregateAppointmentsByLocation(appointments),
      bySpecialty: this.aggregateAppointmentsBySpecialty(appointments),
    };
  }

  private getProfessionalStats(professionals: Professional[]): any {
    return {
      total: professionals.length,
      byLocation: this.groupProfessionalsByLocation(professionals),
    };
  }

  private getEmployeeStats(personSigs: PersonSig[]): any {
    const personSigTypes = this.aggregatePersonSigTypes(personSigs);
    return {
      total: personSigs.length,
      byType: personSigTypes,
    };
  }

  private aggregateMonthlySchedules(schedules: Schedule[]): any {
    return schedules.reduce((acc, schedule) => {
      const availableDate = new Date(schedule.available_date);
      const monthYearKey = `${availableDate.getFullYear()}-${(
        availableDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`;

      if (!acc[monthYearKey]) {
        acc[monthYearKey] = {
          totalSchedules: 0,
          totalVacanciesFilled: 0,
          totalVacanciesAvailable: 0,
          schedulesByLocation: {},
        };
      }

      acc[monthYearKey].totalSchedules += 1;
      acc[monthYearKey].totalVacanciesFilled += schedule.patients_attended;
      acc[monthYearKey].totalVacanciesAvailable +=
        schedule.max_patients - schedule.patients_attended;

      const locationName = schedule.location.name;
      acc[monthYearKey].schedulesByLocation[locationName] =
        (acc[monthYearKey].schedulesByLocation[locationName] || 0) + 1;

      return acc;
    }, {});
  }

  private calculateTotalVacanciesFilled(schedules: Schedule[]): number {
    return schedules.reduce(
      (total, schedule) => total + schedule.patients_attended,
      0,
    );
  }

  private calculateTotalVacanciesAvailable(schedules: Schedule[]): number {
    return schedules.reduce(
      (total, schedule) =>
        total + (schedule.max_patients - schedule.patients_attended),
      0,
    );
  }

  private aggregateSchedulesByLocation(
    schedules: Schedule[],
  ): Record<string, number> {
    return schedules.reduce(
      (acc, schedule) => {
        const locationName = schedule.location.name;
        acc[locationName] = (acc[locationName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private aggregateAppointmentsByMonth(
    appointments: Appointment[],
  ): Record<string, number> {
    const aggregated = appointments.reduce(
      (acc, appointment) => {
        const appointmentDate = new Date(appointment.schedule.available_date);
        const monthYearKey = `${appointmentDate.getFullYear()}-${(appointmentDate.getMonth() + 1).toString().padStart(2, '0')}`;
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
    appointments: Appointment[],
  ): Record<string, number> {
    return appointments.reduce(
      (acc, appointment) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private calculateTotalByStatusByMonth(
    appointments: Appointment[],
  ): Record<string, Record<string, number>> {
    return appointments.reduce(
      (acc, appointment) => {
        const appointmentDate = new Date(appointment.schedule.available_date);
        const monthYearKey = `${appointmentDate.getFullYear()}-${(appointmentDate.getMonth() + 1).toString().padStart(2, '0')}`;

        if (!acc[monthYearKey]) {
          acc[monthYearKey] = {
            attended: 0,
            canceled: 0,
            scheduled: 0,
            missed: 0,
          };
        }

        acc[monthYearKey][appointment.status]++;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );
  }

  private aggregateAppointmentsByLocation(
    appointments: Appointment[],
  ): Record<string, Record<string, number>> {
    const aggregated = appointments.reduce(
      (acc, appointment) => {
        const locationName = `${appointment.schedule.location.name} - ${appointment.schedule.location.city}`;

        if (!acc[locationName]) {
          acc[locationName] = {
            scheduled: 0,
            canceled: 0,
            missed: 0,
            attended: 0,
            total: 0,
          };
        }

        acc[locationName][appointment.status]++;
        acc[locationName].total++;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );

    return Object.fromEntries(
      Object.entries(aggregated).sort(([, a], [, b]) => b.total - a.total),
    );
  }

  private aggregateAppointmentsBySpecialty(
    appointments: Appointment[],
  ): Record<string, Record<string, number>> {
    const aggregated = appointments.reduce(
      (acc, appointment) => {
        const specialtyName = appointment.schedule.specialty.name;

        if (!acc[specialtyName]) {
          acc[specialtyName] = {
            scheduled: 0,
            canceled: 0,
            missed: 0,
            attended: 0,
            total: 0,
          };
        }

        acc[specialtyName][appointment.status]++;
        acc[specialtyName].total++;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );

    return Object.fromEntries(
      Object.entries(aggregated).sort(([, a], [, b]) => b.total - a.total),
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

  private aggregatePersonSigTypes(personSigs: PersonSig[]): any {
    return personSigs.reduce((acc, personSig) => {
      acc[personSig.tipo_servidor] = (acc[personSig.tipo_servidor] || 0) + 1;
      return acc;
    }, {});
  }
}
