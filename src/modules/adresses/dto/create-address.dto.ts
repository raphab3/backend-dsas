import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({
    description: 'The name of the address',
    type: 'string',
    example: 'John Doe',
  })
  name: string;
}
