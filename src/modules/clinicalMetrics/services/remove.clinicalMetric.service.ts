import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalMetric } from '../entities/clinicalMetric.entity';

@Injectable()
export class RemoveClinicalMetricService {
  constructor(
    @InjectRepository(ClinicalMetric)
    private clinicalMetricRepository: Repository<ClinicalMetric>,
  ) {}

  async remove(uuid: string): Promise<void> {
    const clinicalMetric = await this.clinicalMetricRepository.findOne({
      where: { id: uuid },
    });

    if (!clinicalMetric) {
      throw new HttpException('ClinicalMetric não encontrado', 404);
    }

    await this.clinicalMetricRepository.remove(clinicalMetric);
  }
}
