import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateAttendanceHealthInfoDto {
  @ApiProperty({
    description: 'ID do atendimento',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  attendanceId: string;

  @ApiProperty({
    description: 'Lista de alergias do paciente',
    type: [String],
    example: ['Penicilina', 'Látex'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @ApiProperty({
    description: 'Lista de doenças crônicas do paciente',
    type: [String],
    example: ['Diabetes', 'Hipertensão'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicConditions?: string[];
}
