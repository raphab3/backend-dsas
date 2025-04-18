import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAllergyDto } from './create-allergy.dto';
import { CreateChronicConditionDto } from './create-chronic-condition.dto';

export class PatientHealthInfoDto {
  @ApiProperty({
    description: 'ID do atendimento',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  attendanceId: string;

  @ApiProperty({
    description: 'ID do paciente',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'ID do profissional',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  professionalId: string;

  @ApiProperty({
    description: 'Lista de alergias simples (apenas nomes)',
    type: [String],
    example: ['Penicilina', 'Látex'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @ApiProperty({
    description: 'Lista de alergias detalhadas',
    type: [CreateAllergyDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAllergyDto)
  @IsOptional()
  detailedAllergies?: CreateAllergyDto[];

  @ApiProperty({
    description: 'Lista de doenças crônicas simples (apenas nomes)',
    type: [String],
    example: ['Diabetes', 'Hipertensão'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicConditions?: string[];

  @ApiProperty({
    description: 'Lista de doenças crônicas detalhadas',
    type: [CreateChronicConditionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChronicConditionDto)
  @IsOptional()
  detailedChronicConditions?: CreateChronicConditionDto[];
}
