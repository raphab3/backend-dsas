import IScheduleRepository from './IScheduleRepository';
import { CreateScheduleDto } from '@modules/schedules/dto/create-schedule.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { UpdateScheduleDto } from '@modules/schedules/dto/update-schedule.dto';
import { IQuerySchedule } from '@modules/schedules/interfaces/IQuerySchedule';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class ScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private ormRepository: Repository<Schedule>,
  ) {}

  public async list(
    query: Partial<IQuerySchedule>,
  ): Promise<IPaginatedResult<Schedule>> {
    let page = 1;
    let perPage = 10;

    const scheduleCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('schedules')
      .leftJoinAndSelect('schedules.professional', 'professional')
      .leftJoinAndSelect('schedules.specialty', 'specialty')
      .orderBy('schedules.created_at', 'DESC');

    const where: Partial<IQuerySchedule> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    scheduleCreateQueryBuilder.where(where);

    const result: IPaginatedResult<Schedule> = await paginate(
      scheduleCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async create(data: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.ormRepository.create(data);
    await this.ormRepository.save(schedule);
    return schedule;
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

  public async update(id: string, data: UpdateScheduleDto): Promise<Schedule> {
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
