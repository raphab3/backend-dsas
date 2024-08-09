import { ApiProperty } from '@nestjs/swagger';

export class GetByMatriculaPersonSigDto {
  @ApiProperty({
    description: 'A matrícula para filtrar os recursos',
    required: false,
    type: 'string',
  })
  matricula: string;
}
