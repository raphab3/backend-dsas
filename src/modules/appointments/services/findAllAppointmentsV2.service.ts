import { Injectable } from '@nestjs/common';
import { QueryAppointmentDto } from '../dto/query-Appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../typeorm/entities/Appointment.entity';
import { Repository } from 'typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { StatusAppointmentEnum } from '../interfaces/IAppointment';

interface IPatientInfo {
  id: string;
  name: string;
  cpf: string;
  birth_date: string;
  gender: string;
  phone: string;
  is_dependent: boolean;
  degree_of_kinship?: string;
  tipo_servidor?: string;
}

interface IResponse {
  id: string;
  professional_name: string;
  status: StatusAppointmentEnum;
  schedule_id: string;
  schedule_specialty_id: string;
  schedule_specialty: string;
  schedule_available_date: string;
  schedule_start_time: string;
  schedule_end_time: string;
  location_name: string;
  location_description: string;
  location_city: string;
  location_id: string;
  patient: IPatientInfo;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class FindAlAppointmentsV2Service {
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
  ): Promise<IPaginatedResult<IResponse>> {
    const page = query.page || 1;
    const perPage = query.perPage || 10;

    const baseQueryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.schedule', 'schedule')
      .leftJoinAndSelect('schedule.location', 'location')
      .leftJoinAndSelect('schedule.specialty', 'specialty')
      .leftJoinAndSelect('schedule.professional', 'professional')
      .leftJoinAndSelect('professional.person_sig', 'person_sig_profesional')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.dependent', 'dependent')
      .leftJoinAndSelect('patient.person_sig', 'person_sig')
      .leftJoinAndSelect('person_sig.user', 'user');

    if (query.location_id) {
      baseQueryBuilder.andWhere('location.id = :locationId', {
        locationId: query.location_id,
      });
    }
    if (query.specialty_id) {
      baseQueryBuilder.andWhere('specialty.id = :specialtyId', {
        specialtyId: query.specialty_id,
      });
    }

    if (query.available_date) {
      const startDate = new Date(query.available_date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(query.available_date);
      endDate.setUTCHours(23, 59, 59, 999);

      baseQueryBuilder.andWhere(
        'schedule.available_date BETWEEN :start AND :end',
        {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        },
      );
    }

    if (query.status) {
      baseQueryBuilder.andWhere('appointment.status = :status', {
        status: query.status,
      });
    }

    baseQueryBuilder.orderBy('schedule.available_date', 'DESC');

    const result: IPaginatedResult<any> = await paginate(baseQueryBuilder, {
      page,
      perPage,
    });

    const formattedData: IResponse[] = result.data.map((data) => ({
      id: data.id,
      professional_name: data?.schedule?.professional?.person_sig?.nome,
      status: data.status,
      schedule_id: data?.schedule?.id,
      schedule_specialty_id: data?.schedule?.specialty?.id,
      schedule_specialty: data?.schedule?.specialty?.name,
      schedule_available_date: data?.schedule?.available_date,
      schedule_start_time: data?.schedule?.start_time,
      schedule_end_time: data?.schedule.end_time,
      location_name: data?.schedule?.location.name,
      location_description: data?.schedule?.location?.description,
      location_city: data?.schedule?.location?.city,
      location_id: data?.schedule?.location.id,
      patient: this.getPatientInfo(data.patient),
      created_at: data.created_at,
      updated_at: data.updated_at,
    }));

    return {
      data: formattedData,
      pagination: result.pagination,
    };
  }

  private getPatientInfo(patient: any): IPatientInfo {
    const standardizeDateFormat = (date: string): string => {
      // Verifica se a data está no formato "DD/MM/YYYY"
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
      }
      // Se já estiver no formato "YYYY-MM-DD", retorna como está
      return date;
    };

    if (patient.dependent) {
      return {
        id: patient.dependent.id,
        name: patient.dependent.name,
        cpf: patient.dependent.cpf,
        birth_date: standardizeDateFormat(patient.dependent.birth_date),
        gender: patient.dependent.gender,
        phone: patient.dependent.phone,
        degree_of_kinship: patient.dependent.degree_of_kinship,
        is_dependent: true,
      };
    } else {
      return {
        id: patient.person_sig.id,
        name: patient.person_sig.nome,
        cpf: patient.person_sig.cpf,
        birth_date: standardizeDateFormat(patient.person_sig.data_nascimento),
        gender: patient.person_sig.sexo === 'M' ? 'male' : 'female',
        phone: patient.person_sig.telefone,
        tipo_servidor: patient.person_sig.tipo_servidor,
        is_dependent: false,
      };
    }
  }
}
