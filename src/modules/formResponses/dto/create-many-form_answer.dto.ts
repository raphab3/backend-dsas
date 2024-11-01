import { ApiProperty } from '@nestjs/swagger';

export class CreateManyFormAnswerDto {
  @ApiProperty({
    description: 'The list of forms templates id',
    type: [String],
    items: {
      type: 'string',
    },
  })
  template_ids: string[];
}
