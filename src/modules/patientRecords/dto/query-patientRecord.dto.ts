import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryPatientRecordDto extends IQuery {
  @ApiProperty({
    description: 'Nome do patientRecord',
    example: '123456',
    type: String,
  })
  name: string;
}
