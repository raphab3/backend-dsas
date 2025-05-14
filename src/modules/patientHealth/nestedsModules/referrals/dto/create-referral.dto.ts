import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ReferralPriorityEnum } from '../entities/referral.entity';

export class CreateReferralDto {
  @ApiProperty({
    description: 'ID do atendimento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  attendanceId: string;

  @ApiProperty({
    description: 'ID do paciente',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'ID do profissional',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsUUID()
  professionalId: string;

  @ApiProperty({
    description: 'ID da especialidade de destino',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @IsNotEmpty()
  @IsUUID()
  targetSpecialtyId: string;

  @ApiProperty({
    description: 'ID do local de destino (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174004',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  targetLocationId?: string;

  @ApiProperty({
    description: 'Motivo do encaminhamento',
    example: 'Avaliação cardiológica para cirurgia',
  })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Observações clínicas',
    example: 'Paciente com histórico de hipertensão e diabetes',
    required: false,
  })
  @IsOptional()
  @IsString()
  clinicalObservations?: string;

  @ApiProperty({
    description: 'Prioridade do encaminhamento',
    enum: ReferralPriorityEnum,
    example: ReferralPriorityEnum.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReferralPriorityEnum)
  priority?: ReferralPriorityEnum;
}
