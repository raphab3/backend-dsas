import { ApiProperty } from '@nestjs/swagger';
import {
  DegreeOfKinshipEnuns,
  DegreeOfKinshipType,
  GenderEnuns,
} from '../interfaces/IDependent';

export class CreateDependentDto {
  @ApiProperty({
    description: 'The matricula of the dependent',
    type: 'string',
    example: '528991',
  })
  matricula: string;

  @ApiProperty({
    description: 'The name of the dependent',
    type: 'string',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: `The degree of kinship of the dependent. 
    It must be one of the following values: ${[...DegreeOfKinshipEnuns]}`,
    type: 'string',
    example: 'father',
  })
  degree_of_kinship: DegreeOfKinshipType;

  @ApiProperty({
    description: 'The date of birth of the dependent',
    type: 'string',
    example: '1990-01-01',
  })
  birth_date?: string;

  @ApiProperty({
    description: 'The cpf of the dependent',
    type: 'string',
    example: '12345678900',
  })
  cpf?: string;

  @ApiProperty({
    description: `
      The gender of the dependent. ${[...GenderEnuns]}
    `,
    type: 'string',
    example: 'male',
  })
  gender?: string;

  @ApiProperty({
    description: 'The phone of the dependent',
    type: 'string',
    example: '12345678900',
  })
  phone?: string;
}
