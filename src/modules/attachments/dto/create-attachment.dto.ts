import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty({
    description: 'The name of the attachment',
    type: 'string',
    example: 'John Doe',
  })
  name: string;
}
