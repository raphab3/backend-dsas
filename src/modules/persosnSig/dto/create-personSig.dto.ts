import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonSigDto {
  @ApiProperty({
    description: 'The name of the personSig',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'The patent of the personSig',
    type: 'string',
    example: 'Soldado',
  })
  patent: string;

  @ApiProperty({
    description: 'The post of the personSig',
    type: 'string',
    example: 'Desenvolvedor',
  })
  post: string;

  @ApiProperty({
    description: 'The military_identity of the personSig',
    type: 'string',
    example: '123456789',
  })
  military_identity: string;

  @ApiProperty({
    description: 'The date_birth of the personSig',
    type: 'string',
    example: '1990-01-01',
  })
  date_birth: Date;

  @ApiProperty({
    description: 'The cod_unit of the personSig',
    type: 'string',
    example: '123456789',
  })
  cod_unit: string;

  @ApiProperty({
    description: 'The situation of the personSig',
    type: 'string',
    example: 'Ativo',
  })
  situation: string;

  @ApiProperty({
    description: 'The unit of the personSig',
    type: 'string',
    example: '1º BPE',
  })
  unit: string;

  @ApiProperty({
    description: 'The image of the personSig',
    type: 'string',
    example: 'https://www.google.com.br',
  })
  image: string;

  @ApiProperty({
    description: 'The is_military of the personSig',
    type: 'boolean',
    example: true,
  })
  is_military: boolean;
}
