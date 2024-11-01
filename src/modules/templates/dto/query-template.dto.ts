import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryTemplateDto extends IQuery {
  @ApiProperty({
    description: 'Nome do template',
    example: '123456',
    type: String,
  })
  name: string;
}
