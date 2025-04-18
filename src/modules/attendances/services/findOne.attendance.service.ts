import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { VitalSigns } from '@modules/VitalSigns/entities/VitalSigns.entity';
import { PatientHealthInfoService } from '@modules/patientHealth/services/patient-health-info.service';
import { PatientAllergy } from '@modules/patientHealth/entities/allergy.entity';
import { ChronicCondition } from '@modules/patientHealth/entities/chronicCondition.entity';
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
  healthInfo?: {
    allergies: PatientAllergy[];
    chronicConditions: ChronicCondition[];
  };
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

interface IResponse {
  id: string;
  code: string;
  professional_name: string | null;
  professional_id: string | null;
  specialty_name: string | null;
  location_name: string | null;
  status: string;
  formResponseIds: string[];
  appointment_id: string | null;
  appointment_status: string | null;
  startAttendance: string | Date;
  endAttendance: string | null | Date;
  evolution: {
    content: string;
    updatedAt: Date;
  } | null;
  patient: IPatientInfo;
  vitalSigns: VitalSigns | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  documents: Document[];
  attachments: IAttachmentInfo[];
  summary: any;
}

@Injectable()
export class FindOneAttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private patientHealthInfoService: PatientHealthInfoService,
    private storageProvider: S3Provider,
  ) {}

  async findOne(id: string): Promise<IResponse> {
    const attendance = await this.attendanceRepository
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
      .leftJoinAndSelect('attendanceAttachments.uploadedBy', 'uploadedBy')
      .where('attendance.id = :id', { id })
      .getOne();

    if (!attendance) {
      return null;
    }

    // Buscar informações do paciente incluindo dados de saúde
    const patientInfo = await this.getPatientInfo(attendance.patient);

    // Processar anexos e gerar URLs pré-assinadas
    const attachments = await this.processAttachments(
      attendance.attendanceAttachments,
    );

    return {
      id: attendance.id,
      code: attendance.code,
      professional_name: attendance?.professional?.person_sig?.nome ?? null,
      professional_id: attendance?.professional?.id ?? null,
      specialty_name:
        attendance?.specialty?.name ??
        attendance?.appointment?.schedule?.specialty?.name ??
        null,
      location_name:
        attendance?.location?.name ??
        attendance?.appointment?.schedule?.location?.name ??
        null,
      status: attendance.status,
      formResponseIds: attendance.formResponseIds || [],
      appointment_id: attendance.appointment?.id ?? null,
      appointment_status: attendance.appointment?.status ?? null,
      startAttendance: attendance.startAttendance,
      endAttendance: attendance.endAttendance,
      evolution: attendance.evolution
        ? {
            content: attendance.evolution,
            updatedAt: attendance.evolutionUpdatedAt,
          }
        : null,
      patient: patientInfo,
      vitalSigns: attendance.vitalSigns,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
      summary: attendance.summary,
      documents: [],
      attachments: attachments,
    };
  }

  private async getPatientInfo(patient: any): Promise<IPatientInfo> {
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

    // Buscar informações de saúde do paciente
    const healthInfo = await this.patientHealthInfoService.getPatientHealthInfo(
      patient.id,
    );

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
        healthInfo,
      };
    }

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
      healthInfo,
    };
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
