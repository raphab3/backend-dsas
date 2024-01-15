import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionalDto {
  @ApiProperty({
    description: 'The crm of the professional',
    type: 'string',
    example: '123456PB',
  })
  crm: string;

  @ApiProperty({
    description: 'The user_id of the professional',
    type: 'string',
    example: 'uuid',
  })
  user_id: string;

  @ApiProperty({
    description: 'The person_sig_id of the professional',
    type: 'string',
    example: 'uuid',
  })
  person_sig_id: string;

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
