import { CreateClinicalMetricDto } from '@modules/clinicalMetrics/dto/create-clinicalMetric.dto';
import { Document } from '@modules/Documents/entities/document.entity';
import { FormResponseMongoDocument } from '@modules/formResponses/schemas/form_response.schema';

export enum AttendanceStatusEnum {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  PAUSED = 'paused',
}

export interface ExtractedData {
  metrics: Array<Partial<CreateClinicalMetricDto>>;
  documents: Array<Partial<Document>>;
  summary: Record<string, any[]>;
}

export interface IDataExtractor {
  canExtract(formResponse: FormResponseMongoDocument): boolean;
  extract(formResponse: FormResponseMongoDocument): Promise<ExtractedData>;
}

export interface FormProcessor {
  process(formResponse: FormResponseMongoDocument): Promise<ExtractedData>;
  extractMetrics(
    formResponse: FormResponseMongoDocument,
  ): Promise<Array<Partial<CreateClinicalMetricDto>>>;
  extractDocuments(
    formResponse: FormResponseMongoDocument,
  ): Promise<Array<Partial<Document>>>;
  extractSummary(
    formResponse: FormResponseMongoDocument,
  ): Promise<Record<string, any[]>>;
}
