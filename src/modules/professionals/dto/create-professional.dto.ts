import { ILocation } from '@modules/locations/interfaces/ILocation';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionalDto {
  @ApiProperty({
    description: 'The matricula of the professional',
    type: 'string',
    example: '123456',
  })
  matricula: string;

  @ApiProperty({
    description: 'The council of the professional',
    type: 'string',
    example: '123456PB',
  })
  council: string;

  @ApiProperty({
    description: 'The specialties of the professional',
    type: 'array',
    required: false,
    example: [
      {
        id: 'uuid',
      },
    ],
  })
  specialties: Partial<Specialty>[];

  @ApiProperty({
    description: 'The locations of the professional',
    type: 'array',
    required: false,
    example: [
      {
        id: 'uuid',
      },
    ],
  })
  locations: Partial<ILocation>[];
}
