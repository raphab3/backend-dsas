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
    description: 'The crm of the professional',
    type: 'string',
    example: '123456PB',
  })
  crm: string;

  @ApiProperty({
    description: 'The specialties of the professional',
    type: 'array',
    example: [
      {
        id: 'uuid',
      },
    ],
  })
  specialties: Partial<Specialty>[];
}
