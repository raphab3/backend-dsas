import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Repository } from 'typeorm';
import { ClinicalMetric } from '../entities/clinicalMetric.entity';
import { QueryClinicalMetricDto } from '../dto/query-clinicalMetric.dto';

@Injectable()
export class FindAllClinicalMetricService {
  constructor(
    @InjectRepository(ClinicalMetric)
    private clinicalMetricRepository: Repository<ClinicalMetric>,
  ) {}

  async execute(query: QueryClinicalMetricDto): Promise<IPaginatedResult<ClinicalMetric>> {
    let page = 1;
    let perPage = 10;

    const clinicalMetricCreateQueryBuilder = this.clinicalMetricRepository
      .createQueryBuilder('clinicalMetrics')
      .orderBy('clinicalMetrics.created_at', 'DESC');

    if (query.id) {
      clinicalMetricCreateQueryBuilder.where('clinicalMetrics.id = :id', { id: query.id });
    }

    if (query.name) {
      clinicalMetricCreateQueryBuilder.where('clinicalMetrics.name ILike :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      clinicalMetricCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }
}
