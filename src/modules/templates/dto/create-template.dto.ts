import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'The name of the template',
    type: 'string',
    example: 'John Doe',
  })
  name?: string;
}
