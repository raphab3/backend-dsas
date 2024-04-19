import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';
import { StatusAppointmentEnum } from '../interfaces/IAppointment';

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
    description: 'The patient name of the appomentment',
    type: 'string',
    required: false,
  })
  patient_name?: string;

  @ApiProperty({
    description: 'The status of the appomentment',
    type: StatusAppointmentEnum,
    required: false,
  })
  status?: StatusAppointmentEnum;

  @ApiProperty({
    description: 'The date of the appomentment',
    type: 'boolean',
    required: false,
  })
  dateInPastFiltered?: boolean;

  @ApiProperty({
    description: 'The schedule id',
    type: 'string',
    required: false,
  })
  schedule_id?: string;

  @ApiProperty({
    description: 'Schedule code',
    type: 'string',
    example: '123456',
  })
  schedule_code: string;
}
