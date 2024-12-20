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
import { Schedule } from '@modules/schedules/typeorm/entities/schedule.entity';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';

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
      console.log('error', error);
      if (error.code === '23505') {
        throw new HttpException(
          'Erro ao criar agendamento, já existe um agendamento para este paciente e horário',
          409,
        );
      }
      throw new HttpException(
        'Erro ao criar agendamento, tente novamente',
        500,
      );
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
      .leftJoinAndSelect('schedule.professional', 'professional')
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
      const startDate = new Date(query.available_date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(query.available_date);
      endDate.setUTCHours(23, 59, 59, 999);

      appointmentsCreateQueryBuilder.andWhere(
        'schedule.available_date BETWEEN :start AND :end',
        {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        },
      );
    }

    if (query.matricula) {
      appointmentsCreateQueryBuilder.andWhere(
        'person_sig.matricula ILike :matricula',
        {
          matricula: `%${query.matricula}%`,
        },
      );
    }

    if (query.professional_uuid) {
      appointmentsCreateQueryBuilder.andWhere(
        'schedule.professional.id = :professional_uuid',
        {
          professional_uuid: query.professional_uuid,
        },
      );
    }

    if (query.schedule_id) {
      appointmentsCreateQueryBuilder.andWhere('schedule.id = :schedule_id', {
        schedule_id: query.schedule_id,
      });
    }

    if (query.schedule_code) {
      appointmentsCreateQueryBuilder.andWhere('schedule.code = :code', {
        code: query.schedule_code,
      });
    }

    if (query.patient_name) {
      appointmentsCreateQueryBuilder.andWhere(
        `COALESCE(dependent.name, person_sig.nome) ILike :name`,
        {
          name: `%${query.patient_name}%`,
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
        'schedule.description ILike :description',
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
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      appointmentsCreateQueryBuilder.andWhere(
        'schedule.available_date <= :available_date',
        {
          available_date: formattedToday,
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

  public async remove(appointment: Appointment): Promise<void> {
    await this.ormRepository.remove(appointment);
  }

  public async update(
    id: string,
    data: UpdateAppointmentDto & { schedule_id: string; patient_id: string },
  ): Promise<Appointment> {
    const appointment = await this.ormRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Aqui, você atribui diretamente os valores atualizados para a entidade
    if (data.schedule_id) {
      appointment.schedule = { id: data.schedule_id } as Schedule;
    }
    if (data.patient_id) {
      appointment.patient = { id: data.patient_id } as Patient; // o mesmo aqui
    }
    appointment.status = data.status; // atualiza o status

    // O método save() agora dispara os eventos @BeforeUpdate, @AfterUpdate, etc.
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
