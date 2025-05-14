import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryClinicalMetricDto extends IQuery {
  @ApiProperty({
    description: 'Nome do clinicalMetric',
    example: '123456',
    type: String,
  })
  name: string;
}
