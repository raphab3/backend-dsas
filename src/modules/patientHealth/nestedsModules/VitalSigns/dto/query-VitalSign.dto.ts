import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryVitalSignsDto extends IQuery {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false, description: 'Filter by patient ID' })
  patientId?: string;

  @ApiProperty({ required: false, description: 'Filter by attendance ID' })
  attendanceId?: string;
}
