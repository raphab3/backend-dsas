import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class IQueryAudit extends IQuery {
  @ApiProperty({
    description: 'Id da auditoria',
    type: 'string',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Id do usuário que realizou a ação de audi',
    type: 'string',
    example: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Matrícula do servidor',
    type: 'string',
    example: '123456',
  })
  matricula: string;
}
