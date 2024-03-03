import IScheduleRepository from './IScheduleRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { IQuerySchedule } from '@modules/schedules/interfaces/IQuerySchedule';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import {
  ICreateSchedule,
  IUpdateSchedule,
} from '@modules/schedules/interfaces/ISchedule';

@Injectable()
class ScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private ormRepository: Repository<Schedule>,
  ) {}

  public async list(
    query: Partial<IQuerySchedule>,
  ): Promise<IPaginatedResult<Schedule>> {
    try {
      let page = 1;
      let perPage = 10;

      const scheduleCreateQueryBuilder = this.ormRepository
        .createQueryBuilder('schedules')
        .leftJoinAndSelect('schedules.professional', 'professional')
        .leftJoinAndSelect('professional.person_sig', 'professional_person_sig')
        .leftJoinAndSelect('schedules.specialty', 'specialty')
        .leftJoinAndSelect('schedules.appointments', 'appointments')
        .leftJoinAndSelect('appointments.patient', 'patient')
        .leftJoinAndSelect('schedules.location', 'location')
        .orderBy('schedules.created_at', 'DESC');

      const where: Partial<
        IQuerySchedule & {
          professional: {
            person_sig: {
              matricula: any;
            };
          };
          location: {
            id: any;
          };
          specialty: {
            id: any;
          };
        }
      > = {};

      if (query.id) {
        where.id = query.id;
      }

      if (query.professional_matricula) {
        where.professional = {
          person_sig: {
            matricula: ILike(`%${query.professional_matricula}%`),
          },
        };
      }

      if (query.specialty_id) {
        where.specialty = {
          id: query.specialty_id,
        };
      }

      if (query.location_id) {
        where.location = {
          id: query.location_id,
        };
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
    } catch (error) {
      console.log('error', error);
    }
  }

  public async create(data: ICreateSchedule): Promise<Schedule> {
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

  public async update(id: string, data: IUpdateSchedule): Promise<Schedule> {
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
