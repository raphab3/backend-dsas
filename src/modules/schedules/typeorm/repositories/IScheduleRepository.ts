import { Schedule } from '../entities/schedule.entity';
import { IQuerySchedule } from '@modules/schedules/interfaces/IQuerySchedule';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import {
  ICreateSchedule,
  IResponseEndUser,
  IUpdateSchedule,
} from '@modules/schedules/interfaces/ISchedule';

export default interface IScheduleRepository {
  create(data: ICreateSchedule): Promise<Schedule>;
  list(
    query: Partial<IQuerySchedule>,
  ): Promise<IPaginatedResult<Schedule | IResponseEndUser>>;
  findOne(id: string): Promise<Schedule | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: IUpdateSchedule): Promise<Schedule>;
  findConflictingSchedules(
    professionalId: string,
    locationId: string,
    startDate: Date,
    endDate: Date,
    startTime: string,
    endTime: string,
  ): Promise<Schedule[]>;
}
