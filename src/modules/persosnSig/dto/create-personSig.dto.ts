import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonSigDto {
  @ApiProperty({
    description: 'The name of the personSig',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
