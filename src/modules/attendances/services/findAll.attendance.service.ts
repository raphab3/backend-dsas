import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { QueryAttendanceDto } from '../dto/query-attendance.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { VitalSigns } from '@modules/VitalSigns/entities/VitalSigns.entity';
import { AttendanceAttachment } from '../entities/attendanceAttachment.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

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

interface IAttachmentInfo {
  id: string;
  uuid: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  createdAt: Date;
  file_url: string;
  uploadedBy?: {
    id: string;
    nome?: string;
    matricula?: string;
  } | null;
}

export interface IResponse {
  id: string;
  professional_name: string | null;
  professional_id: string | null;
  specialty_name: string | null;
  location_name: string | null;
  status: string;
  formResponseIds: string[];
  appointment_id: string | null;
  appointment_status: string | null;
  startAttendance: string | Date;
  endAttendance: string | Date | null;
  patient: IPatientInfo;
  vitalSigns: VitalSigns;
  attachments: IAttachmentInfo[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

@Injectable()
export class FindAllAttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private storageProvider: S3Provider,
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
      .leftJoinAndSelect('attendance.vitalSigns', 'vitalSigns')
      .leftJoinAndSelect('attendance.appointment', 'appointment')
      .leftJoinAndSelect('appointment.schedule', 'schedule')
      .leftJoinAndSelect('schedule.specialty', 'schedule_specialty')
      .leftJoinAndSelect('schedule.location', 'location')
      .leftJoinAndSelect('attendance.specialty', 'specialty')
      .leftJoinAndSelect('attendance.location', 'attendance_location')
      .leftJoinAndSelect(
        'attendance.attendanceAttachments',
        'attendanceAttachments',
      )
      .leftJoinAndSelect('attendanceAttachments.attachment', 'attachment')
      .leftJoinAndSelect('attendanceAttachments.uploadedBy', 'uploadedBy');

    baseQueryBuilder
      .orderBy('attendance.startAttendance', 'DESC')
      .addOrderBy('attendance.updatedAt', 'DESC');

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

    const formattedData: IResponse[] = await Promise.all(
      result.data.map(async (data) => {
        // Process attachments and generate presigned URLs
        const attachments = await this.processAttachments(
          data.attendanceAttachments,
        );

        return {
          id: data.id,
          code: data.code,
          professional_name: data?.professional?.person_sig?.nome ?? null,
          professional_id: data?.professional?.id ?? null,
          specialty_name:
            data?.specialty?.name ??
            data?.appointment?.schedule?.specialty?.name ??
            null,
          location_name:
            data?.location?.name ??
            data?.appointment?.schedule?.location?.name ??
            null,
          status: data.status,
          formResponseIds: data.formResponseIds || [],
          appointment_id: data.appointment?.id ?? null,
          appointment_status: data.appointment?.status ?? null,
          startAttendance: data.startAttendance,
          endAttendance: data.endAttendance,
          patient: this.getPatientInfo(data.patient),
          vitalSigns: data.vitalSigns,
          attachments,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }),
    );

    return {
      data: formattedData,
      pagination: result.pagination,
    };
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

  private async processAttachments(
    attendanceAttachments: AttendanceAttachment[],
  ): Promise<IAttachmentInfo[]> {
    if (!attendanceAttachments || attendanceAttachments.length === 0) {
      return [];
    }

    return Promise.all(
      attendanceAttachments.map(async (attendanceAttachment) => {
        const attachment = attendanceAttachment.attachment;
        const presignedUrl = await this.storageProvider.getSignedUrl(
          attachment.path,
          12 * 60 * 60, // 12 hours expiration
        );

        return {
          id: attachment.id,
          uuid: attachment.uuid,
          filename: attachment.filename,
          originalname: attachment.originalname,
          mimetype: attachment.mimetype,
          size: attachment.size,
          createdAt: attendanceAttachment.createdAt,
          file_url: presignedUrl,
          uploadedBy: attendanceAttachment.uploadedBy
            ? {
                id: attendanceAttachment.uploadedBy.id,
                nome: attendanceAttachment.uploadedBy.nome,
                matricula: attendanceAttachment.uploadedBy.matricula,
              }
            : null,
        };
      }),
    );
  }
}
