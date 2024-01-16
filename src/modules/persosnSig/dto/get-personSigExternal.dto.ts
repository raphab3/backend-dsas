import { ApiProperty } from '@nestjs/swagger';

export class getPersonSigExternalDto {
  @ApiProperty({
    description: 'Matricula',
    type: 'string',
    example: 'matricula',
  })
  matricula: string;
}
