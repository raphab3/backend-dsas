import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ReferralPriorityEnum,
  ReferralStatusEnum,
} from '../entities/referral.entity';

export class UpdateReferralDto {
  @ApiProperty({
    description: 'ID da especialidade de destino',
    example: '123e4567-e89b-12d3-a456-426614174003',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  targetSpecialtyId?: string;

  @ApiProperty({
    description: 'ID do local de destino',
    example: '123e4567-e89b-12d3-a456-426614174004',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  targetLocationId?: string;

  @ApiProperty({
    description: 'Motivo do encaminhamento',
    example: 'Avaliação cardiológica para cirurgia',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

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
    example: ReferralPriorityEnum.URGENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReferralPriorityEnum)
  priority?: ReferralPriorityEnum;

  @ApiProperty({
    description: 'Status do encaminhamento',
    enum: ReferralStatusEnum,
    example: ReferralStatusEnum.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReferralStatusEnum)
  status?: ReferralStatusEnum;

  @ApiProperty({
    description: 'Data de conclusão',
    example: '2023-02-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  completedDate?: string;
}
