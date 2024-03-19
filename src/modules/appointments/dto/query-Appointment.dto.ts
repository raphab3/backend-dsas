import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';
import {
  StatusAppointmentType,
  statusAppointmentOfTypeEnum,
} from '../interfaces/IAppointment';

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

  @ApiProperty({
    description: 'The locations of the appomentment',
    type: 'array',
    required: false,
  })
  locations?: string[];

  @ApiProperty({
    description: 'The professional name of the appomentment',
    type: 'string',
    required: false,
  })
  professional_name?: string;

  @ApiProperty({
    description: 'The status of the appomentment',
    type: statusAppointmentOfTypeEnum,
    required: false,
  })
  status?: StatusAppointmentType;
}
