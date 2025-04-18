import { CreateClinicalMetricDto } from '@modules/clinicalMetrics/dto/create-clinicalMetric.dto';
import { FormResponseMongoDocument } from '@modules/formResponses/schemas/form_response.schema';
import { Injectable } from '@nestjs/common';
import { FormProcessor, ExtractedData } from '../types';
import { Document } from '@modules/Documents/entities/document.entity';

@Injectable()
export class BaseFormProcessor implements FormProcessor {
  async process(
    formResponse: FormResponseMongoDocument,
  ): Promise<ExtractedData> {
    const [metrics, documents, summary] = await Promise.all([
      this.extractMetrics(formResponse),
      this.extractDocuments(formResponse),
      this.extractSummary(formResponse),
    ]);

    return {
      metrics,
      documents,
      summary,
    };
  }

  async extractMetrics(
    formResponse: FormResponseMongoDocument,
  ): Promise<Array<Partial<CreateClinicalMetricDto>>> {
    const metrics: Array<Partial<CreateClinicalMetricDto>> = [];

    for (const session of formResponse.sessions || []) {
      for (const field of session.fields) {
        const metricMeta = field.metadata?.find(
          (m) => m.key === 'clinicalMetric',
        );

        if (metricMeta?.value && field.response) {
          try {
            const metricValue =
              typeof metricMeta.value === 'string'
                ? JSON.parse(metricMeta.value)
                : metricMeta.value;

            metrics.push({
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
                id: formResponse._id.toString(),
                field: field.name,
                session: session.name,
              },
            });
          } catch (error) {
            console.error(
              `Error processing metric for field ${field.name}:`,
              error,
            );
          }
        }
      }
    }

    return metrics;
  }

  async extractDocuments(
    formResponse: FormResponseMongoDocument,
  ): Promise<Array<Partial<Document>>> {
    const documents: Array<Partial<Document>> = [];

    for (const session of formResponse.sessions || []) {
      for (const field of session.fields) {
        const documentMeta = field.metadata?.find((m) => m.key === 'document');

        if (documentMeta?.value && field.response) {
          try {
            const documentConfig =
              typeof documentMeta.value === 'string'
                ? JSON.parse(documentMeta.value)
                : documentMeta.value;

            documents.push({
              content: field.response,
              name: documentConfig.name,
              type: documentConfig.type,
              form_response_id: formResponse._id.toString(),
            });
          } catch (error) {
            console.error(
              `Error processing document for field ${field.name}:`,
              error,
            );
          }
        }
      }
    }

    return documents;
  }

  async extractSummary(
    formResponse: FormResponseMongoDocument,
  ): Promise<Record<string, any[]>> {
    const summary: Record<string, any[]> = {};

    for (const session of formResponse.sessions || []) {
      for (const field of session.fields) {
        const summaryMeta = field.metadata?.find((m) => m.key === 'summary');
        if (summaryMeta?.value && field.response) {
          const category = summaryMeta.value.category;
          if (!summary[category]) {
            summary[category] = [];
          }
          summary[category].push(field.response);
        }
      }
    }

    return summary;
  }
}
