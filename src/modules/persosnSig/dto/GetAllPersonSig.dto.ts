import { ApiProperty } from '@nestjs/swagger';

export class GetAllPersonSiglDto {
  @ApiProperty({
    description: 'o ID para filtrar os recursos',
    required: false,
  })
  id?: string;

  @ApiProperty({
    description: 'A matrícula para filtrar os recursos',
    required: false,
  })
  matricula?: string;

  @ApiProperty({
    description: 'O nome para filtrar os recursos',
    required: false,
  })
  nome?: string;
}
