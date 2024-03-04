import IAppointmentRepository from './IAppointmentRepository';
import { Appointment } from '../entities/Appointment.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { UpdateAppointmentDto } from '@modules/appointments/dto/update-Appointment.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { ICreateAppointment } from '@modules/appointments/interfaces/ICreateAppintment';
import { QueryAppointmentDto } from '@modules/appointments/dto/query-Appointment.dto';

@Injectable()
class AppointmentRepository implements IAppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private ormRepository: Repository<Appointment>,
  ) {}

  public async create(data: ICreateAppointment): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      schedule: {
        id: data.schedule_id,
      },
      patient: {
        id: data.patient_id,
      },
    });

    try {
      await this.ormRepository.save(appointment);
      return appointment;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Erro ao criar agendamento, já existe um agendamento para este paciente e horário',
          409,
        );
      }
      new HttpException('Erro ao criar agendamento, tente novamente', 500);
    }
  }

  public async list(
    query: QueryAppointmentDto,
  ): Promise<IPaginatedResult<Appointment>> {
    let page = 1;
    let perPage = 10;

    const appointmentsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('appointments')
      .leftJoinAndSelect('appointments.schedule', 'schedule')
      .leftJoinAndSelect('appointments.patient', 'patient')
      .leftJoinAndSelect('patient.dependent', 'dependent')
      .leftJoinAndSelect('patient.person_sig', 'person_sig')
      .orderBy('appointments.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    // search by available_date using typeorm for date format
    if (query.available_date) {
      const date = query.available_date.split('T')[0];
      where.schedule = {
        available_date: date,
      };
    }

    if (query.matricula) {
      where.patient = {
        person_sig: {
          matricula: ILike(`%${query.matricula}%`),
        },
      };
    }

    if (query.location_id) {
      where.schedule = {
        location: {
          id: query.location_id,
        },
      };
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
      relations: ['schedule', 'patient'],
    });
  }

  public async existsAppointmentForPatientSchedule(
    patient_id,
    schedule_id,
  ): Promise<boolean> {
    try {
      const appointment = await this.ormRepository
        .createQueryBuilder('appointments')
        .leftJoinAndSelect('appointments.schedule', 'schedule')
        .leftJoinAndSelect('appointments.patient', 'patient')
        .leftJoinAndSelect('patient.person_sig', 'person_sig')
        .where('schedule.id = :schedule_id AND patient.id = :patient_id', {
          schedule_id,
          patient_id,
        })
        .getOne();

      return !!appointment;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: UpdateAppointmentDto & { schedule_id: string; patient_id: string },
  ): Promise<Appointment> {
    const builder = this.ormRepository.createQueryBuilder();
    const appointment = await builder
      .update(Appointment)
      .set({
        schedule: {
          id: data.schedule_id,
        },
        patient: {
          id: data.patient_id,
        },
        status: data.status,
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return appointment.raw[0];
  }
}

export default AppointmentRepository;
