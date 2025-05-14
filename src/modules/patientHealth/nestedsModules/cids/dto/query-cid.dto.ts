import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryCidDto {
  @ApiProperty({
    description: 'Search term for CID code or description',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'CID category',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Page number',
    required: false,
    type: Number,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    required: false,
    type: Number,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  perPage?: number = 10;
}
