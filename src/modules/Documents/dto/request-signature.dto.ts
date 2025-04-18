import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SignatureRequirementDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsOptional()
  @IsNumber()
  position_x?: number;

  @IsOptional()
  @IsNumber()
  position_y?: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class RequestSignatureDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SignatureRequirementDto)
  signatures: SignatureRequirementDto[];

  requester_id?: string;
}
