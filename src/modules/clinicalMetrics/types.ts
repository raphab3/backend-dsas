import { MetricType } from './entities/clinicalMetric.entity';

export interface ValidationResult {
  valid: boolean;
  alert?: 'WARNING' | 'CRITICAL';
  message?: string;
}

export interface MetricRange {
  min?: number;
  max?: number;
  criticalMin?: number;
  criticalMax?: number;
}

export interface ClinicalMetricMetadata {
  type: MetricType;
  code: string;
  metadata: {
    unit?: string;
    referenceRange?: {
      min?: number;
      max?: number;
      criticalMin?: number;
      criticalMax?: number;
    };
    measurementContext?: {
      situation?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}
