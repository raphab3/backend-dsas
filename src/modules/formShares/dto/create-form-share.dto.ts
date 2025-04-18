import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateFormShareDto {
  @ApiProperty({
    description: 'ID da resposta de formulário a ser compartilhada',
    example: '680288f9d2c223c4d0c5285a',
  })
  @IsNotEmpty()
  formResponseId: string;

  @ApiProperty({
    description: 'ID do paciente que receberá o formulário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'ID do atendimento relacionado (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  attendanceId?: string;

  @ApiProperty({
    description: 'Dias de validade do link (padrão: 7 dias)',
    example: 7,
    required: false,
    default: 7,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  expirationDays?: number;
}
