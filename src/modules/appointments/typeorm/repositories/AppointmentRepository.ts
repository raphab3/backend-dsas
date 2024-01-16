import IAppointmentRepository from './IAppointmentRepository';
import { Appointment } from '../entities/Appointment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-Appointment.dto';
import { UpdateAppointmentDto } from '@modules/appointments/dto/update-Appointment.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class AppointmentRepository implements IAppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private ormRepository: Repository<Appointment>,
  ) {}

  public async create(data: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      ...data,
      schedule: {
        id: data.schedule_id,
      },
      patient: {
        id: data.patient_id,
      },
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }

  public async list(query: any): Promise<IPaginatedResult<Appointment>> {
    let page = 1;
    let perPage = 10;

    const appointmentsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('appointments')
      .leftJoinAndSelect('appointments.schedule', 'schedule')
      .leftJoinAndSelect('appointments.patient', 'patient')
      .leftJoinAndSelect('patient.person_sig', 'person_sig')
      .orderBy('appointments.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    appointmentsCreateQueryBuilder.where(where);

    const result: IPaginatedResult<any> = await paginate(
      appointmentsCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findOne(id: string): Promise<Appointment | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const builder = this.ormRepository.createQueryBuilder();
    const appointment = await builder
      .update(Appointment)
      .set({
        ...data,
        schedule: {
          id: data.schedule_id,
        },
        patient: {
          id: data.patient_id,
        },
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return appointment.raw[0];
  }
}

export default AppointmentRepository;
