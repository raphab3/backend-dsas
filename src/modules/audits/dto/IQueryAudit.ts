import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';
import { IsOptional } from 'class-validator';

export class IQueryAudit extends IQuery {
  @IsOptional()
  @ApiProperty({
    description: 'Id da auditoria',
    type: 'string',
    required: false,
  })
  id: string;

  @IsOptional()
  @ApiProperty({
    description: 'Id do usuário que realizou a ação de audi',
    type: 'string',
    required: false,
  })
  userId: string;

  @IsOptional()
  @ApiProperty({
    description: 'Matrícula do servidor',
    type: 'string',
    required: false,
  })
  matricula: string;
}
