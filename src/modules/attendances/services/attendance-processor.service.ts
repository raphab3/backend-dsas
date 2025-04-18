import { CreateClinicalMetricService } from '@modules/clinicalMetrics/services/create.clinicalMetric.service';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '@modules/formResponses/schemas/form_response.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataSource, QueryRunner } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { ExtractedData } from '../types';
import { BaseFormProcessor } from './base-form-processor.service';

@Injectable()
export class AttendanceProcessorService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly formProcessor: BaseFormProcessor,
    private readonly clinicalMetricService: CreateClinicalMetricService,
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
  ) {}

  async processAttendance(attendance: Attendance): Promise<void> {
    // Skip processing if there are no form responses
    if (!attendance.formResponseIds?.length) {
      return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const formResponses = await Promise.all(
        attendance.formResponseIds.map((id) =>
          this.formResponseModel.findById(id).exec(),
        ),
      );

      const consolidatedData = await this.consolidateFormData(formResponses);
      await this.persistProcessedData(
        consolidatedData,
        attendance,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async consolidateFormData(
    formResponses: FormResponseMongoDocument[],
  ): Promise<ExtractedData> {
    const processedData = await Promise.all(
      formResponses.map((form) => this.formProcessor.process(form)),
    );

    return processedData.reduce(
      (acc, curr) => ({
        metrics: [...acc.metrics, ...curr.metrics],
        documents: [...acc.documents, ...curr.documents],
        summary: this.mergeSummaries(acc.summary, curr.summary),
      }),
      {
        metrics: [],
        documents: [],
        summary: {},
      },
    );
  }

  private async persistProcessedData(
    data: ExtractedData,
    attendance: Attendance,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await Promise.all(
      data.metrics.map((metric) =>
        this.clinicalMetricService.execute({
          type: metric.type!,
          code: metric.code!,
          name: metric.name!,
          value: metric.value,
          metadata: metric.metadata,
          source: metric.source,
          patientId: attendance.patient.id,
          professionalId: attendance.professional.id,
          attendanceId: attendance.id,
        }),
      ),
    );

    // Atualizar resumo do atendimento
    await queryRunner.manager.update(Attendance, attendance.id, {
      summary: {
        ...attendance.summary,
        ...data.summary,
      },
    });
  }

  private mergeSummaries(
    summary1: Record<string, any[]>,
    summary2: Record<string, any[]>,
  ): Record<string, any[]> {
    const merged = { ...summary1 };

    Object.entries(summary2).forEach(([key, values]) => {
      if (!merged[key]) {
        merged[key] = [];
      }
      merged[key].push(...values);
    });

    return merged;
  }
}
