import { HttpException, Injectable } from '@nestjs/common';
import { UpdateClinicalMetricDto } from '../dto/update-clinicalMetric.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicalMetric } from '../entities/clinicalMetric.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateClinicalMetricService {
  constructor(
    @InjectRepository(ClinicalMetric)
    private clinicalMetricRepository: Repository<ClinicalMetric>,
  ) {}

  async update(
    uuid: string,
    updateClinicalMetricDto: UpdateClinicalMetricDto,
  ): Promise<void> {
    const clinicalMetric = await this.clinicalMetricRepository.findOne({
      where: { id: uuid },
    });

    if (!clinicalMetric) {
      throw new HttpException('ClinicalMetric não encontrado', 404);
    }

    await this.clinicalMetricRepository.update(uuid, updateClinicalMetricDto);
  }
}
