import { ApiProperty } from '@nestjs/swagger';

export class IQuery {
  @ApiProperty({
    description: 'The id of the item',
    type: 'string',
    required: false,
  })
  id?: string;

  @ApiProperty({
    description: 'The page number',
    type: 'number',
    example: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'The number of items per page',
    type: 'number',
    example: 10,
    required: false,
  })
  perPage?: number;

  @ApiProperty({
    description: 'The order of the items',
    type: 'string',
    required: false,
  })
  order?: any;

  @ApiProperty({
    description: 'The user id',
    type: 'string',
    required: false,
  })
  userId?: any;
}
