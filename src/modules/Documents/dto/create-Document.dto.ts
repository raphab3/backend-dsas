import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { DocumentCategory } from '../entities/document.entity';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DocumentCategory)
  category?: DocumentCategory;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  form_template_id?: string;

  @IsOptional()
  @IsString()
  form_response_id?: string;

  @IsOptional()
  @IsUUID()
  header_template_id?: string;

  @IsOptional()
  @IsUUID()
  footer_template_id?: string;

  @IsOptional()
  @IsBoolean()
  is_signature_required?: boolean;

  created_by?: string;
}
