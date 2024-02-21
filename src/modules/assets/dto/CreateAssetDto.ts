import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({
    description: 'The description of the Asset',
    type: 'string',
    example: 'Asset 1',
  })
  description?: string;

  @ApiProperty({
    description: 'The destination of the Asset',
    type: 'string',
    example: 'Destination 1',
  })
  destination?: string;

  @ApiProperty({
    description: 'The destination responsible of the Asset',
    type: 'string',
    example: 'Destination Responsible 1',
  })
  destination_responsible?: string;

  @ApiProperty({
    description: 'The origin of the Asset',
    type: 'string',
    example: 'Origin 1',
  })
  origin?: string;

  @ApiProperty({
    description: 'The origin responsible of the Asset',
    type: 'string',
    example: 'Origin Responsible 1',
  })
  origin_responsible?: string;

  @ApiProperty({
    description: 'The patrimony of the Asset',
    type: 'string',
    example: 'Patrimony 1',
  })
  patrimony?: string;

  @ApiProperty({
    description: 'The date acquisition of the Asset',
    type: 'string',
    example: '2021-10-10',
  })
  date_acquisition?: Date;

  @ApiProperty({
    description: 'The responsible of the Asset',
    type: 'string',
    example: 'Responsible 1',
  })
  responsible?: string;

  @ApiProperty({
    description: 'The acquisition of the Asset',
    type: 'string',
    example: 'Acquisition 1',
  })
  acquisition?: string;

  @ApiProperty({
    description: 'The location of the Asset',
    type: 'string',
    example: 'Location 1',
  })
  location?: string;

  @ApiProperty({
    description: 'The observations of the Asset',
    type: 'string',
    example: 'Observations 1',
  })
  observations?: string;
}
