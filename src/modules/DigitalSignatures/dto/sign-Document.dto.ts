// sign-Document.dto.ts (versão unificada)
import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SignaturePositionDto {
  @ApiProperty({
    description: 'Página do documento (começando de 0)',
    example: 0,
  })
  @IsNumber()
  @Min(0)
  page: number;

  @ApiProperty({ description: 'Posição X na página (0-1)', example: 0.1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  x: number;

  @ApiProperty({ description: 'Posição Y na página (0-1)', example: 0.1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  y: number;
}

export class SignDocumentDto {
  @ApiProperty({
    description: 'ID do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  documentId: string;

  @ApiProperty({
    description: 'ID do requisito de assinatura',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  signatureRequirementId: string;

  @ApiProperty({
    description: 'ID do certificado (opcional, usa o padrão se não fornecido)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  certificate_id?: string;

  @ApiProperty({ description: 'Senha do certificado', example: 'senha_segura' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Comentários ou razão da assinatura',
    required: false,
    example: 'Aprovado para publicação',
  })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({
    description: 'Posição da assinatura no documento',
    required: false,
    type: SignaturePositionDto,
  })
  @ValidateNested()
  @Type(() => SignaturePositionDto)
  @IsOptional()
  signaturePosition?: SignaturePositionDto;

  // Campo interno, não exposto na API
  user_id?: string;
}
