import {
  IsNotEmpty,
  IsUUID,
  IsObject,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormResponseType } from '../interfaces';

class FieldResponse {
  [key: string]: any;
}

export class CreateFormResponseDto {
  @IsNotEmpty()
  @IsUUID()
  templateId: string;

  @IsNotEmpty()
  @IsEnum(FormResponseType)
  @IsOptional()
  type?: FormResponseType;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => FieldResponse)
  responses?: FieldResponse;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  createdBy?: string;
}
