import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { QueryAttendanceDto } from '../dto/query-attendance.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

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
  professional_name: string | null;
  status: string;
  formResponseIds: string[];
  appointment_id: string | null;
  appointment_status: string | null;
  startAttendance: string;
  endAttendance: string;
  patient: IPatientInfo;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class FindAllAttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(
    query: QueryAttendanceDto,
  ): Promise<IPaginatedResult<IResponse>> {
    const page = query.page || 1;
    const perPage = query.perPage || 10;

    const baseQueryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.professional', 'professional')
      .leftJoinAndSelect('professional.person_sig', 'person_sig_profesional')
      .leftJoinAndSelect('attendance.patient', 'patient')
      .leftJoinAndSelect('patient.dependent', 'dependent')
      .leftJoinAndSelect('patient.person_sig', 'person_sig')
      .leftJoinAndSelect('attendance.appointment', 'appointment');

    baseQueryBuilder.orderBy('attendance.startAttendance', 'DESC');

    if (query.status) {
      baseQueryBuilder.andWhere('attendance.status = :status', {
        status: query.status,
      });
    }

    if (query.listStatus) {
      baseQueryBuilder.andWhere('attendance.status IN (:...listStatus)', {
        listStatus: query.listStatus,
      });
    }

    if (query.professionalId) {
      baseQueryBuilder.andWhere('professional.id = :professionalId', {
        professionalId: query.professionalId,
      });
    }

    if (query.patientId) {
      baseQueryBuilder.andWhere('patient.id = :patientId', {
        patientId: query.patientId,
      });
    }

    const result: IPaginatedResult<any> = await paginate(baseQueryBuilder, {
      page,
      perPage,
    });

    const formattedData: IResponse[] = result.data.map((data) => ({
      id: data.id,
      professional_name: data?.professional?.person_sig?.nome ?? null,
      status: data.status,
      formResponseIds: data.formResponseIds || [],
      appointment_id: data.appointment?.id ?? null,
      appointment_status: data.appointment?.status ?? null,
      startAttendance: data.startAttendance,
      endAttendance: data.endAttendance,
      patient: this.getPatientInfo(data.patient),
      created_at: data.created_at,
      updated_at: data.updated_at,
    }));

    return { data: formattedData, pagination: result.pagination };
  }

  private getPatientInfo(patient: any): IPatientInfo {
    if (!patient) {
      throw new Error('Patient data is required');
    }

    const standardizeDateFormat = (date: string): string => {
      if (!date) return '';
      // Verifica se a data está no formato "DD/MM/YYYY"
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
      }
      return date;
    };

    if (patient.dependent) {
      return {
        id: patient.id,
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
        id: patient.id,
        name: patient.person_sig?.nome ?? '',
        cpf: patient.person_sig?.cpf ?? '',
        birth_date: standardizeDateFormat(
          patient.person_sig?.data_nascimento ?? '',
        ),
        gender: patient.person_sig?.sexo === 'M' ? 'male' : 'female',
        phone: patient.person_sig?.telefone ?? '',
        tipo_servidor: patient.person_sig?.tipo_servidor ?? '',
        is_dependent: false,
      };
    }
  }
}
