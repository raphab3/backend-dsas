import {
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SignaturePositionDto {
  @ApiProperty({
    description: 'Página do documento (começando de 0)',
    example: 0,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Posição X na página (0-1)', example: 0.1 })
  @IsOptional()
  x?: number;

  @ApiProperty({ description: 'Posição Y na página (0-1)', example: 0.1 })
  @IsOptional()
  y?: number;
}

export class SignAttendancePdfDto {
  @ApiProperty({
    description: 'ID do certificado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  certificateId: string;

  @ApiProperty({
    description: 'Senha do certificado',
    example: 'senha_segura',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Incluir evolução no PDF',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  includeEvolution?: boolean;

  @ApiProperty({
    description: 'Razão da assinatura',
    example: 'Atendimento médico realizado',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Posição da assinatura no documento',
    required: false,
    type: SignaturePositionDto,
  })
  @ValidateNested()
  @Type(() => SignaturePositionDto)
  @IsOptional()
  signaturePosition?: SignaturePositionDto;
}
