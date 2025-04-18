import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateAttendanceSpecialtyLocationDto {
  @ApiProperty({
    description: 'Specialty ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @IsOptional()
  @IsUUID()
  specialtyId?: string;

  @ApiProperty({
    description: 'Location ID',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174004',
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;
}
