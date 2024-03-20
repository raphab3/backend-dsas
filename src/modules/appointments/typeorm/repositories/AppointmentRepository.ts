import IAppointmentRepository from './IAppointmentRepository';
import { Appointment } from '../entities/Appointment.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      .leftJoinAndSelect('schedule.location', 'location')
      .orderBy('schedule.available_date', 'ASC')
      .addOrderBy('schedule.start_time', 'ASC');

    if (query.id) {
      appointmentsCreateQueryBuilder.where('appointments.id = :id', {
        id: query.id,
      });
    }

    if (query.available_date) {
      const date = new Date(query.available_date).toISOString().split('T')[0];
      appointmentsCreateQueryBuilder.andWhere(
        'schedule.available_date = :available_date',
        {
          available_date: date,
        },
      );
    }

    if (query.matricula) {
      appointmentsCreateQueryBuilder.andWhere(
        'person_sig.matricula ILIKE :matricula',
        {
          matricula: `%${query.matricula}%`,
        },
      );
    }

    if (query.locations) {
      try {
        appointmentsCreateQueryBuilder.andWhere(
          'location.id IN (:...locations)',
          {
            locations: query.locations,
          },
        );
      } catch (error) {
        console.log('error', error);
      }
    }

    if (query.professional_name) {
      appointmentsCreateQueryBuilder.andWhere(
        'schedule.description ILIKE :description',
        {
          description: `%${query.professional_name}%`,
        },
      );
    }

    if (query.location_id) {
      appointmentsCreateQueryBuilder.andWhere('location.id = :id', {
        id: query.location_id,
      });
    }

    if (query.status) {
      appointmentsCreateQueryBuilder.andWhere('appointments.status = :status', {
        status: query.status,
      });
    }

    if (query.dateInPastFiltered) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formattedYesterday = yesterday.toISOString().split('T')[0];
      appointmentsCreateQueryBuilder.andWhere(
        'schedule.available_date > :date',
        {
          date: formattedYesterday,
        },
      );
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

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
