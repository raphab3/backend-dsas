import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UserInfoDto {
  @ApiProperty({
    description: 'Nome comum no certificado',
    required: false,
    example: 'João da Silva',
  })
  @IsString()
  @IsOptional()
  commonName?: string;

  @ApiProperty({
    description: 'Organização',
    required: false,
    example: 'Empresa XYZ',
  })
  @IsString()
  @IsOptional()
  organization?: string;

  @ApiProperty({
    description: 'Email',
    required: false,
    example: 'joao@empresa.com',
  })
  @IsString()
  @IsOptional()
  email?: string;
}

export class CreateCertificateDto {
  @ApiProperty({
    description: 'Nome do certificado',
    example: 'Meu Certificado de Assinatura',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Senha para proteger a chave privada',
    example: 'senha_segura',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Validade em dias',
    required: false,
    example: 365,
    default: 365,
  })
  @IsInt()
  @Min(1)
  @Max(3650) // Máximo 10 anos
  @IsOptional()
  validityDays?: number;

  @ApiProperty({
    description: 'Definir como certificado padrão',
    required: false,
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    description: 'Informações do usuário no certificado',
    required: false,
    type: UserInfoDto,
  })
  @ValidateNested()
  @Type(() => UserInfoDto)
  @IsOptional()
  userInfo?: UserInfoDto;
}
