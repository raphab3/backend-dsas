import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { DocumentStatus, DocumentType } from '../entities/document.entity';
import { Transform } from 'class-transformer';

export class QueryDocumentDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsUUID()
  created_by?: string;

  @IsOptional()
  @IsUUID()
  form_template_id?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  perPage?: number;
}
