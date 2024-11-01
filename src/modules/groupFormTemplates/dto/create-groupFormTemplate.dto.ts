import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateGroupFormTemplateDto {
  @ApiProperty({
    description: 'The name of the group form template',
    example: 'Monthly Progress Report',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the group form template',
    example: 'A template for tracking monthly progress across departments',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Whether the group form template is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    description: 'Array of form template IDs associated with this group',
    type: [String],
    example: ['uuid1', 'uuid2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  templateIds?: string[];

  @ApiProperty({
    description: 'Array of roles IDs associated with this group',
    type: [String],
    example: ['rolesId1', 'rolesId2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  rolesIds?: string[];

  @ApiProperty({
    description: 'Array of specialty IDs associated with this group',
    type: [String],
    example: ['specialtyId1', 'specialtyId2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  specialtyIds?: string[];
}
