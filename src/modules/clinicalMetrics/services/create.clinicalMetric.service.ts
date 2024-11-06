import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicalMetric } from '../entities/clinicalMetric.entity';
import { Repository } from 'typeorm';
import { CreateClinicalMetricDto } from '../dto/create-clinicalMetric.dto';
import { ValidationResult, MetricRange } from '../types';

@Injectable()
export class CreateClinicalMetricService {
  constructor(
    @InjectRepository(ClinicalMetric)
    private clinicalMetricRepository: Repository<ClinicalMetric>,
  ) {}

  async execute(createClinicalMetricDto: CreateClinicalMetricDto) {
    // Validar a métrica antes de salvar
    const validationResult = this.validateMetric(createClinicalMetricDto);
    if (!validationResult.valid) {
      throw new BadRequestException(validationResult.message);
    }

    // Processar o valor baseado no tipo da métrica
    const processedValue = this.processMetricValue(createClinicalMetricDto);

    // Criar a métrica com o valor processado
    const clinicalMetric = this.clinicalMetricRepository.create({
      patient: createClinicalMetricDto.patient,
      professional: createClinicalMetricDto.professional,
      attendance: createClinicalMetricDto.attendance,
      type: createClinicalMetricDto.type,
      code: createClinicalMetricDto.code,
      name: createClinicalMetricDto.name,
      value: processedValue,
      metadata: createClinicalMetricDto.metadata,
      source: createClinicalMetricDto.source,
      measuredAt: new Date(),
    });

    const clinicalMetricSaved =
      await this.clinicalMetricRepository.save(clinicalMetric);

    // Se houver alerta, adicionar ao metadata
    if (validationResult.alert) {
      clinicalMetricSaved.metadata = {
        ...clinicalMetricSaved.metadata,
        alert: validationResult.alert,
        alertMessage: validationResult.message,
      };
      return this.clinicalMetricRepository.save(clinicalMetricSaved);
    }

    return clinicalMetricSaved;
  }

  private validateMetric(metric: CreateClinicalMetricDto): ValidationResult {
    const { value, metadata } = metric;
    const referenceRange = metadata?.referenceRange as MetricRange;

    if (!referenceRange) return { valid: true };

    // Converter valor para número se for string
    const numericValue = this.convertToNumber(value);
    if (numericValue === null) {
      return {
        valid: false,
        message: 'Valor inválido para o tipo de métrica',
      };
    }

    // Verificar valores críticos
    if (
      referenceRange.criticalMin !== undefined &&
      numericValue < referenceRange.criticalMin
    ) {
      return {
        valid: true,
        alert: 'CRITICAL',
        message: `Valor abaixo do limite crítico (${referenceRange.criticalMin})`,
      };
    }

    if (
      referenceRange.criticalMax !== undefined &&
      numericValue > referenceRange.criticalMax
    ) {
      return {
        valid: true,
        alert: 'CRITICAL',
        message: `Valor acima do limite crítico (${referenceRange.criticalMax})`,
      };
    }

    // Verificar valores de referência
    if (referenceRange.min !== undefined && numericValue < referenceRange.min) {
      return {
        valid: true,
        alert: 'WARNING',
        message: `Valor abaixo do range de referência (${referenceRange.min})`,
      };
    }

    if (referenceRange.max !== undefined && numericValue > referenceRange.max) {
      return {
        valid: true,
        alert: 'WARNING',
        message: `Valor acima do range de referência (${referenceRange.max})`,
      };
    }

    return { valid: true };
  }

  private processMetricValue(metric: CreateClinicalMetricDto): any {
    const { type, value, metadata } = metric;

    // Processar valor baseado no tipo
    switch (type) {
      case 'VITAL_SIGN':
        if (metadata?.format === 'systolic/diastolic') {
          // Processar pressão arterial (formato 120/80)
          const [systolic, diastolic] = String(value).split('/').map(Number);
          return { systolic, diastolic };
        }
        // Aplicar precisão se especificada
        if (metadata?.precision !== undefined) {
          return Number(Number(value).toFixed(metadata.precision));
        }
        return Number(value);

      case 'MEASUREMENT':
        // Aplicar precisão se especificada
        if (metadata?.precision !== undefined) {
          return Number(Number(value).toFixed(metadata.precision));
        }
        return Number(value);

      default:
        return value;
    }
  }

  private convertToNumber(value: any): number | null {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }
    return null;
  }
}
