import { Injectable, Logger } from '@nestjs/common';
import { QueryAppointmentDto } from '../dto/query-Appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../typeorm/entities/Appointment.entity';
import { Repository } from 'typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { StatusAppointmentEnum } from '../interfaces/IAppointment';
import { format } from 'date-fns';

interface IResponseEnduserAttament {
  id: string;
  professional_name: string;
  status: StatusAppointmentEnum;
  schedule_id: string;
  schedule_specialty: string;
  schedule_available_date: string;
  schedule_start_time: string;
  schedule_end_time: string;
  location_name: string;
  location_description: string;
  location_city: string;
  location_id: string;
  patient_name: string;
  is_dependent: boolean;
  dependent_id: string;
  dependent_name: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class FindAllByEnduserAppointmentService {
  private readonly logger = new Logger(FindAllByEnduserAppointmentService.name);
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(query: QueryAppointmentDto): Promise<any> {
    const appointments = await this.list(query);

    return appointments;
  }

  private async list(
    query: QueryAppointmentDto,
  ): Promise<IPaginatedResult<IResponseEnduserAttament>> {
    let page = 1;
    let perPage = 10;

    const appointmentsCreateQueryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.schedule', 'schedule')
      .leftJoinAndSelect('schedule.specialty', 'specialty')
      .leftJoinAndSelect('schedule.professional', 'professional')
      .leftJoinAndSelect('professional.person_sig', 'person_sig_profesional')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.dependent', 'dependent')
      .leftJoinAndSelect('patient.person_sig', 'person_sig')
      .leftJoinAndSelect('person_sig.user', 'user')
      .leftJoinAndSelect('schedule.location', 'location')
      .orderBy('schedule.available_date', 'DESC');

    if (query.id) {
      appointmentsCreateQueryBuilder.where('appointment.id = :id', {
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

    if (query.userId) {
      appointmentsCreateQueryBuilder.andWhere('user.id = :userId', {
        userId: query.userId,
      });
    }

    if (query.matricula) {
      appointmentsCreateQueryBuilder.andWhere(
        'person_sig.matricula ILike :matricula',
        {
          matricula: `%${query.matricula}%`,
        },
      );
    }

    if (query.schedule_id) {
      appointmentsCreateQueryBuilder.andWhere('schedule.id = :schedule_id', {
        schedule_id: query.schedule_id,
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
        this.logger.error('error', error);
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
      appointmentsCreateQueryBuilder.andWhere('appointment.status = :status', {
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

    if (query.nearest_appointment) {
      appointmentsCreateQueryBuilder.orderBy('schedule.available_date', 'ASC');

      const now = new Date();
      const formattedToday = format(now, 'yyyy-MM-dd');
      const currentTimeButOneHour = new Date(now.getTime() + 60 * 60 * 1000);
      const currentTime = format(currentTimeButOneHour, 'HH:mm:ss');

      // Filtra pela data disponível a partir de hoje
      appointmentsCreateQueryBuilder.andWhere(
        'schedule.available_date = :available_date',
        {
          available_date: formattedToday,
        },
      );

      // Filtra pelo status do agendamento
      appointmentsCreateQueryBuilder.andWhere('appointment.status = :status', {
        status: 'scheduled',
      });

      // Adicionar condição para retornar até uma hora antes do término
      appointmentsCreateQueryBuilder.andWhere(
        'schedule.end_time >= :currentTime',
        {
          currentTime,
        },
      );

      // Limita a 1 resultado
      appointmentsCreateQueryBuilder.limit(1);
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

    const formattedData: IResponseEnduserAttament[] = result.data.map(
      (data) => ({
        id: data.id,
        professional_name: data?.schedule?.professional?.person_sig?.nome,
        status: data.status,
        schedule_id: data?.schedule?.id,
        schedule_specialty: data?.schedule?.specialty?.name,
        schedule_available_date: data?.schedule?.available_date,
        schedule_start_time: data?.schedule?.start_time,
        schedule_end_time: data?.schedule.end_time,
        location_name: data?.schedule?.location.name,
        location_description: data?.schedule?.location?.description,
        location_city: data?.schedule?.location?.city,
        location_id: data?.schedule?.location.id,
        patient_name:
          data?.patient?.dependent?.name || data?.patient?.person_sig?.nome,
        is_dependent: !!data?.patient?.dependent,
        dependent_id: data?.patient?.dependent?.id,
        dependent_name: data?.patient?.dependent?.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }),
    );

    return {
      data: formattedData,
      pagination: result.pagination,
    };
  }
}
