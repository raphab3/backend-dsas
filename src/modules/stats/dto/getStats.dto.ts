import { ApiProperty } from '@nestjs/swagger';

export class GetStatsDto {
  @ApiProperty({
    description: 'The start date to filter the resources',
    required: false,
  })
  year?: string;
}
