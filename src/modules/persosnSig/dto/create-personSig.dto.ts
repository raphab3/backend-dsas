import { ApiProperty } from '@nestjs/swagger';
import { OriginType } from '../interfaces/IPersonSig';

export class CreatePersonSigDto {
  @ApiProperty({
    description: 'A matrícula da pessoa',
    type: 'string',
    example: '123456',
    required: false,
  })
  matricula: string;

  @ApiProperty({
    description: 'Tipo do servidor',
    type: 'enum',
    example: 'CIVIL',
    required: true,
  })
  tipo_servidor: OriginType;

  @ApiProperty({
    description: 'As lotações da pessoa',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123456',
        },
      },
    },
    required: false,
  })
  locations?: { id: string }[];

  @ApiProperty({
    description: 'O nome da pessoa',
    type: 'string',
    example: 'João da Silva',
    required: true,
  })
  nome: string;

  @ApiProperty({
    description: 'O email da pessoa',
    type: 'string',
    example: 'teste@g.com',
    required: false,
  })
  email: string;

  @ApiProperty({
    description: 'O ddd do telefone da pessoa',
    type: 'string',
    example: '83',
    required: false,
  })
  ddd: string;

  @ApiProperty({
    description: 'O telefone da pessoa',
    type: 'string',
    example: '999999999',
    required: false,
  })
  telefone: string;

  @ApiProperty({
    description: 'O cpf da pessoa',
    type: 'string',
    example: '00000000000',
    required: false,
  })
  cpf: string;

  @ApiProperty({
    description: 'O sexo da pessoa',
    type: 'string',
    example: 'M',
    required: false,
  })
  sexo: string;
}
