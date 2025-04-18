import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { AttendanceStatusEnum } from '@modules/attendances/types';

export interface IResponseStats {
  schedules: {
    total: number;
    monthly: Record<
      string,
      {
        totalSchedules: number;
        totalVacanciesFilled: number;
        totalVacanciesAvailable: number;
        schedulesByLocation: Record<string, number>;
      }
    >;
    total_vacancies: number;
    total_vacancies_filled: number;
    total_vacancies_available: number;
    schedulesByLocation: Record<string, number>;
  };
  appointments: {
    total: number;
    monthly: Record<string, number>;
    totalHolders: number;
    totalDependents: number;
    total_canceled: number;
    total_attended: number;
    total_scheduled: number;
    total_missed: number;
    bySpecialty: Record<
      string,
      {
        attended: number;
        canceled: number;
        scheduled: number;
        missed: number;
        total: number;
      }
    >;
    totalByStatusByMonth: Record<
      string,
      {
        attended: number;
        canceled: number;
        scheduled: number;
        missed: number;
      }
    >;
    byLocation: Record<
      string,
      {
        attended: number;
        canceled: number;
        scheduled: number;
        missed: number;
        total: number;
      }
    >;
  };
  professionals: {
    total: number;
    byLocation: Record<
      string,
      { professionals: Professional[]; total: number }
    >;
  };
  patients: {
    total: number;
  };
  employees: {
    total: number;
    byType: Record<string, number>;
  };
}

export interface IAttendanceStatsResponse {
  attendances: {
    total: number;
    monthly: Record<string, number>;
    byStatus: Record<AttendanceStatusEnum, number>;
    byStatusByMonth: Record<string, Record<AttendanceStatusEnum, number>>;
    byLocation: Record<
      string,
      {
        inProgress: number;
        completed: number;
        canceled: number;
        paused: number;
        total: number;
      }
    >;
    bySpecialty: Record<
      string,
      {
        inProgress: number;
        completed: number;
        canceled: number;
        paused: number;
        total: number;
      }
    >;
    averageDuration: number; // in minutes
  };
  professionals: {
    total: number;
    byAttendanceCount: Record<string, number>; // professionalName: count
    byLocation: Record<string, { professionals: Array<{ id: string; name: string }>; total: number }>;
  };
  patients: {
    total: number;
    byAttendanceCount: Record<string, number>; // top patients by attendance count
  };
}
