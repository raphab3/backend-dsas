import { ApiProperty } from '@nestjs/swagger';
import { LocationCityEnum } from '../interfaces/ILocation';

export class CreateLocationDto {
  @ApiProperty({
    description: 'The name of the location',
    type: 'string',
    example: 'Location 1',
  })
  name?: string;

  @ApiProperty({
    description: 'The description of the location',
    type: 'string',
    example: 'The best location',
  })
  description?: string;

  @ApiProperty({
    description: 'The city of the location',
    type: 'string',
    example: 'João Pessoa',
    enum: [...Object.values(LocationCityEnum)],
  })
  city?: string;
}
