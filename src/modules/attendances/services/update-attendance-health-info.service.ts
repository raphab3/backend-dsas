import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { UpdateAttendanceHealthInfoDto } from '../dto/update-attendance-health-info.dto';
import { ClinicalMetric, MetricType } from '@modules/clinicalMetrics/entities/clinicalMetric.entity';

@Injectable()
export class UpdateAttendanceHealthInfoService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(ClinicalMetric)
    private clinicalMetricRepository: Repository<ClinicalMetric>,
  ) {}

  async execute(dto: UpdateAttendanceHealthInfoDto): Promise<Attendance> {
    // Buscar o atendimento
    const attendance = await this.attendanceRepository.findOne({
      where: { id: dto.attendanceId },
      relations: ['patient', 'professional'],
    });

    if (!attendance) {
      throw new NotFoundException('Atendimento não encontrado');
    }

    // Processar alergias
    if (dto.allergies && dto.allergies.length > 0) {
      await this.processAllergies(attendance, dto.allergies);
    }

    // Processar doenças crônicas
    if (dto.chronicConditions && dto.chronicConditions.length > 0) {
      await this.processChronicConditions(attendance, dto.chronicConditions);
    }

    return attendance;
  }

  private async processAllergies(attendance: Attendance, allergies: string[]): Promise<void> {
    // Remover métricas de alergia existentes para este atendimento
    await this.clinicalMetricRepository.delete({
      attendance: { id: attendance.id },
      type: MetricType.ALLERGY,
    });

    // Criar novas métricas para cada alergia
    const allergyMetrics = allergies.map(allergy => {
      return this.clinicalMetricRepository.create({
        patient: attendance.patient,
        professional: attendance.professional,
        attendance: attendance,
        type: MetricType.ALLERGY,
        code: 'ALLERGY',
        name: 'Alergia',
        value: allergy,
        metadata: {
          severity: 'HIGH',
          status: 'ACTIVE',
        },
        measuredAt: new Date(),
      });
    });

    await this.clinicalMetricRepository.save(allergyMetrics);
  }

  private async processChronicConditions(attendance: Attendance, conditions: string[]): Promise<void> {
    // Remover métricas de condição existentes para este atendimento
    await this.clinicalMetricRepository.delete({
      attendance: { id: attendance.id },
      type: MetricType.CONDITION,
    });

    // Criar novas métricas para cada condição crônica
    const conditionMetrics = conditions.map(condition => {
      return this.clinicalMetricRepository.create({
        patient: attendance.patient,
        professional: attendance.professional,
        attendance: attendance,
        type: MetricType.CONDITION,
        code: 'CHRONIC_CONDITION',
        name: 'Doença Crônica',
        value: condition,
        metadata: {
          status: 'ACTIVE',
          chronicity: 'CHRONIC',
        },
        measuredAt: new Date(),
      });
    });

    await this.clinicalMetricRepository.save(conditionMetrics);
  }
}
