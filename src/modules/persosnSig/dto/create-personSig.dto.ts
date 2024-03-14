import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonSigDto {
  @ApiProperty({
    description: 'A matrícula da pessoa',
    type: 'string',
    example: '123456',
    required: true,
  })
  matricula: string;

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
}
