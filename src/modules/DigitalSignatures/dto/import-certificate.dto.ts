import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportCertificateDto {
  @ApiProperty({
    description: 'Nome do certificado',
    example: 'Meu Certificado ICP-Brasil',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Certificado em formato PEM',
    example: '-----BEGIN CERTIFICATE-----\n...',
  })
  @IsString()
  certificatePem: string;

  @ApiProperty({
    description: 'Chave privada em formato PEM (opcional)',
    required: false,
    example: '-----BEGIN PRIVATE KEY-----\n...',
  })
  @IsString()
  @IsOptional()
  privateKeyPem?: string;

  @ApiProperty({
    description: 'Senha para a chave privada (se fornecida)',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Provedor do certificado externo',
    required: false,
    example: 'ICP-Brasil',
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({
    description: 'Definir como certificado padrão',
    required: false,
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
