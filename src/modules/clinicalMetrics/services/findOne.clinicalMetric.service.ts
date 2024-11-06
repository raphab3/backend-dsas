import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalMetric } from '../entities/clinicalMetric.entity';

@Injectable()
export class FindOneClinicalMetricService {
  constructor(
    @InjectRepository(ClinicalMetric)
    private clinicalMetricRepository: Repository<ClinicalMetric>,
  ) {}

  async execute(uuid: string): Promise<ClinicalMetric> {
    const clinicalMetric = await this.clinicalMetricRepository.findOne({
      where: { id: uuid },
    });

    if (!clinicalMetric) {
      throw new HttpException('ClinicalMetric não encontrado', 404);
    }

    return clinicalMetric;
  }
}
