import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';

export class QueryFormTemplateDto extends IQuery {
  @ApiProperty({
    description: 'Nome do form_template',
    type: String,
    required: false,
  })
  name: string;

  @ApiProperty({
    description: 'Id do form_template',
    type: String,
    required: false,
  })
  is_published: boolean;

  @ApiProperty({
    description: 'Id do form_template',
    type: String,
    required: false,
  })
  template_mongo_id: string;

  @ApiProperty({
    description: 'Id do usuário',
    type: String,
    required: false,
  })
  user_uuid: string;
}
