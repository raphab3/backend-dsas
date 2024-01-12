import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialtyDto {
  @ApiProperty({
    description: 'The name of the Specialty',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
