import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CombineDocumentsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  document_ids: string[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  header_template_id?: string;

  @IsOptional()
  @IsUUID()
  footer_template_id?: string;

  @IsOptional()
  @IsBoolean()
  add_separators?: boolean;

  @IsOptional()
  @IsBoolean()
  add_table_of_contents?: boolean;

  created_by?: string;
}
