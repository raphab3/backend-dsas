import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { IQueryStats } from '../interfaces/IQueryStats';
import { IResponseStats } from '../interfaces/IResponseStats';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { StatisticsGateway } from '../../../shared/gateways/StatisticsGateway';
import { EventsService } from '@shared/events/EventsService';

@Injectable()
export class GetStatsService implements OnModuleInit {
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
  ) {}

  onModuleInit() {
    this.eventsService.on('statsUpdated', async () => {
      console.log('Stats updated event received');
      const updatedStats = await this.execute({});
      this.statsGateway.sendUpdatedStats(updatedStats);
    });
  }

  async execute(query: IQueryStats): Promise<IResponseStats> {
    let startDate: Date;
    let endDate: Date;

    if (startDate > endDate) {
      throw new Error('Invalid date range');
    }

    if (query.startDate && query.endDate) {
      startDate = query.startDate;
      endDate = query.endDate;
    } else if (query.year) {
      startDate = new Date(`${query.year}-01-01`);
      endDate = new Date(`${query.year}-12-31`);
    } else {
      const today = new Date();
      const currentYear = today.getFullYear();
      startDate = new Date(`${currentYear}-01-01`);
      endDate = new Date(`${currentYear}-12-31`);
    }

    const [, totalSchedules] = await this.scheduleRepository.findAndCount({});
    const schedules = await this.findSchedules(startDate, endDate);
    const appointments = await this.findAppointments(startDate, endDate);
    const [professionals, totalProfessionalsCount] =
      await this.professionalRepository.findAndCount({
        relations: ['locations', 'person_sig'],
      });
    const [, totalPatientsCount] = await this.patientRepository.findAndCount();
    const [personSigs, totalPersonSigCount] =
      await this.personSigRepository.findAndCount();

    const personSigTypes = personSigs.reduce((acc, personSig) => {
      if (!acc[personSig.tipo_servidor]) {
        acc[personSig.tipo_servidor] = 0;
      }

      acc[personSig.tipo_servidor] += 1;

      return acc;
    }, {});

    const monthlySchedules = await this.aggregateMonthlySchedules(
      startDate,
      endDate,
    );
    const appointmentsByMonth = this.aggregateAppointmentsByMonth(appointments);
    const appointmentsByLocation =
      this.aggregateAppointmentsByLocation(appointments);

    const appointmentsBySpecialty =
      this.aggregateAppointmentsBySpecialty(appointments);

    const totalsByStatus = this.calculateTotalsByStatus(appointments);
    const totalByStatusByMonth =
      this.calculateTotalByStatusByMonth(appointments);

    const professionalsByLocation =
      this.groupProfessionalsByLocation(professionals);

    const stats: IResponseStats = {
      schedules: {
        total: totalSchedules,
        monthly: monthlySchedules,
        total_vacancies_filled: this.calculateTotalVacanciesFilled(schedules),
        total_vacancies_available:
          this.calculateTotalVacanciesAvailable(schedules),
        schedulesByLocation: this.aggregateSchedulesByLocation(schedules),
      },
      appointments: {
        total: appointments.length,
        monthly: appointmentsByMonth,
        totalHolders: appointments.filter(
          (appointment) => !appointment?.patient?.dependent?.id,
        ).length,
        totalDependents: appointments.filter(
          (appointment) => !!appointment?.patient?.dependent?.id,
        ).length,
        total_canceled: totalsByStatus['canceled'] || 0,
        total_attended: totalsByStatus['attended'] || 0,
        total_scheduled: totalsByStatus['scheduled'] || 0,
        total_missed: totalsByStatus['missed'] || 0,
        totalByStatusByMonth,
        byLocation: appointmentsByLocation,
        bySpecialty: appointmentsBySpecialty,
      },
      professionals: {
        total: totalProfessionalsCount,
        byLocation: professionalsByLocation,
      },
      patients: {
        total: totalPatientsCount,
      },
      employees: {
        total: totalPersonSigCount,
        byType: personSigTypes,
      },
    };

    return stats;
  }

  private async aggregateMonthlySchedules(startDate: Date, endDate: Date) {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const schedules = await this.scheduleRepository.find({
      where: { available_date: Between(startDateStr, endDateStr) },
      relations: ['location'],
    });

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
      if (!acc[monthYearKey].schedulesByLocation[locationName]) {
        acc[monthYearKey].schedulesByLocation[locationName] = 1;
      } else {
        acc[monthYearKey].schedulesByLocation[locationName] += 1;
      }

      return acc;
    }, {});
  }

  private async findSchedules(startDate: Date, endDate: Date) {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    return this.scheduleRepository.find({
      where: { available_date: Between(startDateStr, endDateStr) },
      relations: ['location'],
    });
  }

  private async findAppointments(startDate: Date, endDate: Date) {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    return this.appointmentRepository.find({
      relations: [
        'schedule',
        'schedule.location',
        'schedule.specialty',
        'patient',
        'patient.dependent',
      ],
      where: {
        schedule: {
          available_date: Between(startDateStr, endDateStr),
        },
      },
    });
  }

  private aggregateAppointmentsByMonth(appointments: Appointment[]) {
    const aggregateAppointmentsByLocation = appointments.reduce(
      (acc, appointment) => {
        const appointmentDate = new Date(appointment.schedule.available_date);
        const monthYearKey = `${appointmentDate.getFullYear()}-${(
          appointmentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}`;

        if (!acc[monthYearKey]) {
          acc[monthYearKey] = 0;
        }

        acc[monthYearKey] += 1;

        return acc;
      },
      {},
    );

    // order by month
    const sortedArray = Object.entries(aggregateAppointmentsByLocation).sort(
      (a: any, b: any) => {
        return new Date(a[0]).getTime() - new Date(b[0]).getTime();
      },
    );

    const sortedObject = sortedArray.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    return sortedObject;
  }

  private aggregateAppointmentsByLocation(appointments: Appointment[]) {
    const aggregated = appointments.reduce((acc, appointment) => {
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

      acc[locationName][appointment.status] += 1;
      acc[locationName].total += 1;

      return acc;
    }, {});

    const sortedArray = Object.entries(aggregated).sort((a: any, b: any) => {
      return b[1].total - a[1].total;
    });

    const sortedObject = sortedArray.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    return sortedObject;
  }

  private aggregateAppointmentsBySpecialty(appointments: Appointment[]) {
    const aggregated = appointments.reduce((acc, appointment) => {
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

      acc[specialtyName][appointment.status] += 1;
      acc[specialtyName].total += 1;

      return acc;
    }, {});

    const sortedArray = Object.entries(aggregated).sort((a: any, b: any) => {
      return b[1].total - a[1].total;
    });

    const sortedObject = sortedArray.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    return sortedObject;
  }

  private calculateTotalsByStatus(appointments: Appointment[]) {
    return appointments.reduce((acc, appointment) => {
      if (!acc[appointment.status]) {
        acc[appointment.status] = 0;
      }

      acc[appointment.status] += 1;

      return acc;
    }, {});
  }

  private calculateTotalByStatusByMonth(appointments: Appointment[]) {
    return appointments.reduce((acc, appointment) => {
      const appointmentDate = new Date(appointment.schedule.available_date);
      const monthYearKey = `${appointmentDate.getFullYear()}-${(
        appointmentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}`;

      if (!acc[monthYearKey]) {
        acc[monthYearKey] = {
          attended: 0,
          canceled: 0,
          scheduled: 0,
          missed: 0,
        };
      }

      acc[monthYearKey][appointment.status] += 1;

      return acc;
    }, {});
  }

  private calculateTotalVacanciesFilled(schedules: Schedule[]) {
    return schedules.reduce(
      (acc, schedule) => acc + schedule.patients_attended,
      0,
    );
  }

  private calculateTotalVacanciesAvailable(schedules: Schedule[]) {
    return schedules.reduce(
      (acc, schedule) =>
        acc + (schedule.max_patients - schedule.patients_attended),
      0,
    );
  }

  private aggregateSchedulesByLocation(schedules: Schedule[]) {
    return schedules.reduce((acc, schedule) => {
      const locationName = schedule.location.name;

      if (!acc[locationName]) {
        acc[locationName] = 0;
      }

      acc[locationName] += 1;

      return acc;
    }, {});
  }

  private groupProfessionalsByLocation(
    professionals: Professional[],
  ): Record<string, { professionals: Professional[]; total: number }> {
    return professionals.reduce((accumulator, professional) => {
      professional.locations.forEach((location) => {
        const locationName = location.name;
        if (!accumulator[locationName]) {
          accumulator[locationName] = { professionals: [], total: 0 }; // Initialize total
        }
        accumulator[locationName].professionals.push({
          id: professional.id,
          name: professional.person_sig.nome,
        });
        accumulator[locationName].total++; // Increment the total count
      });
      return accumulator;
    }, {});
  }
}
