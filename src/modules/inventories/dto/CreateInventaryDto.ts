import { ApiProperty } from '@nestjs/swagger';

export class CreateInventaryDto {
  @ApiProperty({
    description: 'The name of the Inventay',
    type: 'string',
    example: 'Inventory 1',
  })
  name?: string;
}
