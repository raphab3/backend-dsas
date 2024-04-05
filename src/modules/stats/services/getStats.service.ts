import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { IQueryStats } from '../interfaces/IQueryStats';
import { IResponseStats } from '../interfaces/IResponseStats';

@Injectable()
export class GetStatsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async execute(query: IQueryStats): Promise<IResponseStats> {
    const statsYear = query.year || new Date().getFullYear();

    const startDate = new Date(statsYear, 0, 1);
    const endDate = new Date(statsYear, 11, 31);

    const [, totalSchedules] = await this.scheduleRepository.findAndCount({});
    const schedules = await this.findSchedules(startDate, endDate);
    const appointments = await this.findAppointments(startDate, endDate);
    const monthlySchedules = await this.aggregateMonthlySchedules(
      startDate,
      endDate,
    );
    const appointmentsByMonth = this.aggregateAppointmentsByMonth(appointments);
    const appointmentsByLocation =
      this.aggregateAppointmentsByLocation(appointments);
    const totalsByStatus = this.calculateTotalsByStatus(appointments);
    const totalByStatusByMonth =
      this.calculateTotalByStatusByMonth(appointments);

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
        total_canceled: totalsByStatus['canceled'] || 0,
        total_attended: totalsByStatus['attended'] || 0,
        total_scheduled: totalsByStatus['scheduled'] || 0,
        total_missed: totalsByStatus['missed'] || 0,
        totalByStatusByMonth,
        byLocation: appointmentsByLocation,
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
      relations: ['schedule', 'schedule.location'],
      where: {
        schedule: {
          available_date: Between(startDateStr, endDateStr),
        },
      },
    });
  }

  private aggregateAppointmentsByMonth(appointments: Appointment[]) {
    return appointments.reduce((acc, appointment) => {
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
    }, {});
  }

  private aggregateAppointmentsByLocation(appointments: Appointment[]) {
    return appointments.reduce((acc, appointment) => {
      const locationName = appointment.schedule.location.name;

      if (!acc[locationName]) {
        acc[locationName] = {
          scheduled: 0,
          canceled: 0,
          missed: 0,
          attended: 0,
        };
      }

      acc[locationName][appointment.status] += 1;

      return acc;
    }, {});
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
}
