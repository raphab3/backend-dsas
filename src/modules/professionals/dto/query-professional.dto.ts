import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryProfessionalDto extends IQuery {
  @ApiProperty({
    description: 'Nome do profissional',
    type: 'string',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Matrícula do profissional',
    type: 'string',
    required: false,
  })
  matricula?: string;

  @ApiProperty({
    description: 'Especialidade do profissional',
    type: 'string',
    required: false,
  })
  specialty?: string;

  @ApiProperty({
    description: 'Id da localização',
    type: 'string',
    required: false,
  })
  location_id?: string;

  @ApiProperty({
    description: 'Id da especialidade',
    type: 'string',
    required: false,
  })
  specialty_id?: string;
}
