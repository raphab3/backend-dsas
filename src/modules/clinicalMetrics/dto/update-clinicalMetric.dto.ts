import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicalMetricDto } from './create-clinicalMetric.dto';

export class UpdateClinicalMetricDto extends PartialType(CreateClinicalMetricDto) {
  name?: string;
}
