import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryAppointmentDto extends IQuery {
  @ApiProperty({
    description: 'The matricula of the appomentment',
    type: 'string',
    required: false,
  })
  matricula?: string;

  @ApiProperty({
    description: 'The schedule date of the appomentment',
    type: 'string',
    required: false,
  })
  available_date?: string;

  @ApiProperty({
    description: 'The location id of the appomentment',
    type: 'string',
    required: false,
  })
  location_id?: string;
}
