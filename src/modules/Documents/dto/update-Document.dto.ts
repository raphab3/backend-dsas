import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { DocumentStatus } from '../entities/document.entity';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsString()
  next_action?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  header_template_id?: string;

  @IsOptional()
  @IsUUID()
  footer_template_id?: string;

  @IsOptional()
  @IsBoolean()
  is_signature_required?: boolean;

  last_updated_by?: string;
}
