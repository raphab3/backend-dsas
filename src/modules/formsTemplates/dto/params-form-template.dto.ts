import { ApiProperty } from '@nestjs/swagger';

export class ParamsFormTemplateDto {
  @ApiProperty({
    description: 'UUID do form_template',
    type: String,
  })
  uuid: string;
}
