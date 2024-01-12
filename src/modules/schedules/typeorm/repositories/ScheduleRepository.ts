import IScheduleRepository from './IScheduleRepository';
import { CreateScheduleDto } from '@modules/schedules/dto/create-schedule.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
class ScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private ormRepository: Repository<Schedule>,
  ) {}

  public async create(data: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.ormRepository.create(data);
    await this.ormRepository.save(schedule);
    return schedule;
  }

  public async list(): Promise<Schedule[]> {
    return this.ormRepository.find();
  }

  public async findOne(id: string): Promise<Schedule | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: CreateScheduleDto): Promise<Schedule> {
    const builder = this.ormRepository.createQueryBuilder();
    const schedule = await builder
      .update(Schedule)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return schedule.raw[0];
  }
}

export default ScheduleRepository;
