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
    total_vacancies_filled: number;
    total_vacancies_available: number;
    schedulesByLocation: Record<string, number>;
  };
  appointments: {
    total: number;
    monthly: Record<string, number>;
    total_canceled: number;
    total_attended: number;
    total_scheduled: number;
    total_missed: number;
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
      }
    >;
  };
}
