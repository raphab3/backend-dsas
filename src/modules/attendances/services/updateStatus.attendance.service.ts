import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AttendanceStatusEnum } from '../types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusAppointmentEnum } from '@modules/appointments/interfaces/IAppointment';
import { Appointment } from '@modules/appointments/typeorm/entities/Appointment.entity';
import { CreateClinicalMetricDto } from '@modules/clinicalMetrics/dto/create-clinicalMetric.dto';
import { MetricType } from '@modules/clinicalMetrics/entities/clinicalMetric.entity';
import { CreateClinicalMetricService } from '@modules/clinicalMetrics/services/create.clinicalMetric.service';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '@modules/formResponses/schemas/form_response.schema';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Model } from 'mongoose';

export class UpdateStatusAttendanceDto {
  @ApiProperty({
    enum: AttendanceStatusEnum,
    description: 'The new status for the attendance',
    example: AttendanceStatusEnum.COMPLETED,
  })
  @IsEnum(AttendanceStatusEnum)
  status: AttendanceStatusEnum;
}

@Injectable()
export class UpdateStatusAttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private createClinicalMetricService: CreateClinicalMetricService,
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
  ) {}

  async execute(
    attendanceId: string,
    updateStatusAttendanceDto: UpdateStatusAttendanceDto,
  ) {
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
      relations: ['appointment', 'patient', 'professional'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    this.validateStatusTransition(
      attendance.status,
      updateStatusAttendanceDto.status,
    );

    attendance.status = updateStatusAttendanceDto.status;

    if (updateStatusAttendanceDto.status === AttendanceStatusEnum.COMPLETED) {
      await this.handleAttendanceCompletion(attendance);
    }

    return this.attendanceRepository.save(attendance);
  }

  private async processFormResponsesForMetrics(
    attendance: Attendance,
  ): Promise<CreateClinicalMetricDto[]> {
    const processedMetrics: CreateClinicalMetricDto[] = [];

    if (!attendance.formResponseIds?.length) return processedMetrics;

    for (const formResponseId of attendance.formResponseIds) {
      const formResponse = await this.formResponseModel
        .findById(formResponseId)
        .exec();

      if (!formResponse) continue;

      this.extractAttendanceSummary(attendance, formResponse);

      for (const session of formResponse.sessions || []) {
        for (const field of session.fields) {
          const metricMeta = field.metadata?.find(
            (m) => m.key === 'clinicalMetric',
          );

          if (metricMeta?.value && field.response) {
            try {
              // Converter a string para objeto se necessário
              const metricValue =
                typeof metricMeta.value === 'string'
                  ? JSON.parse(metricMeta.value)
                  : metricMeta.value;

              if (!Object.values(MetricType).includes(metricValue.type)) {
                console.warn(
                  `Invalid metric type ${metricValue.type} for field ${field.name}`,
                );
                continue;
              }

              const metric = await this.createClinicalMetricService.execute({
                patient: { id: attendance.patient.id },
                professional: { id: attendance.professional.id },
                attendance: { id: attendance.id },
                type: metricValue.type,
                code: metricValue.code,
                name: field.label,
                value: field.response,
                metadata: {
                  ...metricValue.metadata,
                  measurementContext: {
                    ...metricValue.metadata?.measurementContext,
                    measuredAt: new Date(),
                    session: session.name,
                  },
                },
                source: {
                  type: 'FORM_RESPONSE',
                  id: formResponseId,
                  field: field.name,
                  session: session.name,
                },
              });

              processedMetrics.push(metric);
            } catch (error) {
              console.error(
                `Error processing metric for field ${field.name}:`,
                error,
                '\nMetric value type:',
                typeof metricMeta.value,
                '\nMetric value:',
                metricMeta.value,
                '\nField response:',
                field.response,
              );
            }
          }
        }
      }
    }

    return processedMetrics;
  }

  private extractAttendanceSummary(
    attendance: Attendance,
    formResponse: FormResponseMongoDocument,
  ) {
    // Inicializar o objeto summary
    const summary: any = {
      mainComplaints: [],
      diagnosis: [],
      procedures: [],
      recommendations: [],
    };

    // Procurar campos específicos no FormResponse
    formResponse.sessions?.forEach((session) => {
      session.fields.forEach((field) => {
        if (field.response) {
          switch (field.name) {
            case 'queixa-principal':
              summary.mainComplaints.push(field.response);
              break;
            case 'diagnostico':
              summary.diagnosis.push(field.response);
              break;
            case 'procedimentos':
              summary.procedures.push(field.response);
              break;
            case 'recomendacoes':
              summary.recommendations.push(field.response);
              break;
            // Adicione outros campos conforme necessário
          }
        }
      });
    });

    // Atualizar o summary do attendance
    attendance.summary = summary;
  }

  private async handleAttendanceCompletion(attendance: Attendance) {
    try {
      // Atualizar data de término apenas se não existir
      if (!attendance.endAttendance) {
        attendance.endAttendance = new Date();
      }

      // Atualizar appointment apenas se necessário
      if (
        attendance.appointment &&
        attendance.appointment.status !== StatusAppointmentEnum.ATTENDED
      ) {
        const appointment = await this.appointmentRepository.findOne({
          where: { id: attendance.appointment.id },
        });
        if (appointment) {
          appointment.status = StatusAppointmentEnum.ATTENDED;
          await this.appointmentRepository.save(appointment);
        }
      }

      // Processar métricas
      if (attendance.formResponseIds?.length) {
        const metrics = await this.processFormResponsesForMetrics(attendance);

        // Atualizar summary
        attendance.summary = {
          ...attendance.summary,
          metricsProcessed: metrics.length,
          metricsWithAlerts: metrics.filter((m) => m.metadata?.alert).length,
          processedAt: new Date(),
        };
      }

      return await this.attendanceRepository.save(attendance);
    } catch (error) {
      throw new BadRequestException(
        `Error completing attendance: ${error.message}`,
      );
    }
  }

  private validateStatusTransition(
    currentStatus: AttendanceStatusEnum,
    newStatus: AttendanceStatusEnum,
  ) {
    const validTransitions = {
      [AttendanceStatusEnum.IN_PROGRESS]: [
        AttendanceStatusEnum.PAUSED,
        AttendanceStatusEnum.COMPLETED,
      ],
      [AttendanceStatusEnum.PAUSED]: [
        AttendanceStatusEnum.IN_PROGRESS,
        AttendanceStatusEnum.COMPLETED,
      ],
      [AttendanceStatusEnum.COMPLETED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
