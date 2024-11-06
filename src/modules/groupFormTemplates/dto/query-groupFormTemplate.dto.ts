import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryGroupFormTemplateDto extends IQuery {
  @ApiProperty({
    description: 'Nome do groupFormTemplate',
    example: '123456',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Identificador do groupFormTemplate',
    example: '123456',
    type: String,
  })
  @Optional()
  professionalSpecialtyIds?: string[];

  @ApiProperty({
    description: 'Identificador do groupFormTemplate',
    example: '123456',
    type: String,
  })
  @Optional()
  professionalRoleIds?: string[];
}
