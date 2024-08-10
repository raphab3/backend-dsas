import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString } from 'class-validator';

export class ImprovedGetStatsDto {
  @ApiProperty({
    description: 'The start date to filter the resources',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'The end date to filter the resources',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Location id',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  locationId?: string;
}
