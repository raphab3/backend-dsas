import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    description: 'The name of the location',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
