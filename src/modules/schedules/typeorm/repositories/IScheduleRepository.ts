import { CreateScheduleDto } from '@modules/schedules/dto/create-schedule.dto';
import { Schedule } from '../entities/schedule.entity';

export default interface IScheduleRepository {
  create(data: CreateScheduleDto): Promise<Schedule>;
  list(): Promise<Schedule[]>;
  findOne(id: string): Promise<Schedule | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateScheduleDto): Promise<Schedule>;
}
