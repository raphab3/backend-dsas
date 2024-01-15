import { CreateScheduleDto } from '@modules/schedules/dto/create-schedule.dto';
import { Schedule } from '../entities/schedule.entity';
import { IQuerySchedule } from '@modules/schedules/interfaces/IQuerySchedule';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface IScheduleRepository {
  create(data: CreateScheduleDto): Promise<Schedule>;
  list(query: Partial<IQuerySchedule>): Promise<IPaginatedResult<Schedule>>;
  findOne(id: string): Promise<Schedule | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateScheduleDto): Promise<Schedule>;
}
