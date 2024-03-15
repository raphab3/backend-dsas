import { ApiProperty } from '@nestjs/swagger';
import { FormationEnum } from '../interfaces/ISpecialty';

export class CreateSpecialtyDto {
  @ApiProperty({
    description: 'The name of the Specialty',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'The formation of the Specialty',
    type: 'enum',
    example: 'MEDICINA',
  })
  formation?: FormationEnum;
}
