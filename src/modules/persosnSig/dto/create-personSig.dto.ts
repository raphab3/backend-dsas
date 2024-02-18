import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonSigDto {
  @ApiProperty({
    description: 'A matrícula da pessoa',
    type: 'string',
    example: '123456',
  })
  matricula: string;
}
