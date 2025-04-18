import { PartialType } from '@nestjs/mapped-types';
import { CreateAllergyDto } from './create-allergy.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAllergyDto extends PartialType(CreateAllergyDto) {
  @ApiProperty({
    description: 'Se a alergia ainda está ativa',
    type: 'boolean',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
