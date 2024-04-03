import IScheduleRepository from './IScheduleRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { IQuerySchedule } from '@modules/schedules/interfaces/IQuerySchedule';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import {
  ICreateSchedule,
  IUpdateSchedule,
} from '@modules/schedules/interfaces/ISchedule';
import { format } from 'date-fns';

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

      if (query.id) {
        scheduleCreateQueryBuilder.where({
          id: query.id,
        });
      }

      if (query.professional_matricula) {
        scheduleCreateQueryBuilder.andWhere(
          'professional_person_sig.matricula ILike :matricula',
          {
            matricula: `%${query.professional_matricula}%`,
          },
        );
      }

      if (query.specialty_id) {
        scheduleCreateQueryBuilder.andWhere('specialty.id = :specialty_id', {
          specialty_id: query.specialty_id,
        });
      }

      if (query.location_id) {
        scheduleCreateQueryBuilder.andWhere('location.id = :location_id', {
          location_id: query.location_id,
        });
      }

      if (query.locations) {
        scheduleCreateQueryBuilder.andWhere('location.id IN (:...locations)', {
          locations: query.locations,
        });
      }

      if (query.professional_name) {
        scheduleCreateQueryBuilder.andWhere(
          'professional_person_sig.nome ILike :nome',
          {
            nome: `%${query.professional_name}%`,
          },
        );
      }

      if (query.page) page = query.page;
      if (query.perPage) perPage = query.perPage;

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
      relations: ['appointments'],
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: IUpdateSchedule): Promise<Schedule> {
    const builder = this.ormRepository.createQueryBuilder('schedules');
    const createSchedule = this.ormRepository.create(data);
    const schedule = await builder
      .update(Schedule)
      .set(createSchedule)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return schedule.raw[0];
  }

  public async findConflictingSchedules(
    professionalId: string,
    locationId: string,
    startDate: Date,
    endDate: Date,
    startTime: string,
    endTime: string,
  ): Promise<Schedule[]> {
    const formattedStartDate =
      format(startDate, 'yyyy-MM-dd') + ' ' + startTime;
    const formattedEndDate = format(endDate, 'yyyy-MM-dd') + ' ' + endTime;

    const schedules = await this.ormRepository
      .createQueryBuilder('schedules')
      .leftJoinAndSelect('schedules.location', 'location')
      .leftJoinAndSelect('schedules.professional', 'professional')
      .where('professional.id = :professionalId', { professionalId })
      .andWhere('location.id = :locationId', { locationId })
      .andWhere('schedules.available_date BETWEEN :startDate AND :endDate', {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
      .andWhere(
        `
        (schedules.start_time < :endTime AND schedules.end_time > :startTime)
      `,
        { startTime, endTime },
      )
      .getMany();

    return schedules;
  }
}

export default ScheduleRepository;
