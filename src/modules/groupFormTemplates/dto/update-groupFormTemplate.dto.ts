import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdateGroupFormTemplateDto {
  @ApiProperty({
    description: 'The name of the group form template',
    example: 'Monthly Progress Report',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the group form template',
    example: 'A template for tracking monthly progress across departments',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the group form template is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Array of form template IDs associated with this group',
    type: [String],
    example: ['uuid1', 'uuid2'],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  templateIds?: string[];

  @ApiProperty({
    description: 'Array of specialty IDs associated with this group',
    type: [String],
    example: ['specialtyId1', 'specialtyId2'],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  specialtyIds?: string[];

  @ApiProperty({
    description: 'Array of role IDs associated with this group',
    type: [String],
    example: ['roleId1', 'roleId2'],
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];
}
