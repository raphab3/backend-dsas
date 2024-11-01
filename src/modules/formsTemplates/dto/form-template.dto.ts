import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  FieldType,
  ConditionType,
  OperationType,
  FormCategory,
  RuleType,
} from '../types';
import { Types } from 'mongoose';

class ValidationRule {
  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @IsOptional()
  @IsNumber()
  @Max(1000000)
  max?: number;
}

class MetadataDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: string | number;
}

class FieldOption {
  @IsOptional()
  @Type(() => Types.ObjectId)
  _id?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  value: string | number;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
}

class FormField {
  @IsOptional()
  @Type(() => Types.ObjectId)
  _id?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(FieldType)
  type: FieldType;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ValidationRule)
  validations: ValidationRule;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOption)
  options?: FieldOption[];

  @IsNumber()
  @Min(0)
  order: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetadataDto)
  metadata: MetadataDto[];
}

class FormSession {
  @IsOptional()
  @Type(() => Types.ObjectId)
  _id?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormField)
  fields: FormField[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

class Calculation {
  @IsEnum(OperationType)
  operation: OperationType;

  @IsArray()
  @IsString({ each: true })
  sourceFields: string[];
}

class Condition {
  @IsString()
  sourceRuleId: string;

  @IsEnum(ConditionType)
  operator: ConditionType;

  @IsNotEmpty()
  value: number | string;
}

class Rule {
  @IsOptional()
  @Type(() => Types.ObjectId)
  _id?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(RuleType)
  type: RuleType;

  @IsOptional()
  @ValidateNested()
  @Type(() => Calculation)
  calculation?: Calculation;

  @IsOptional()
  @ValidateNested()
  @Type(() => Condition)
  condition?: Condition;

  @IsOptional()
  @IsString()
  result?: string;
}

export class CreateFormTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(FormCategory)
  category?: FormCategory;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormSession)
  sessions?: FormSession[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Rule)
  rules?: Rule[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetadataDto)
  metadata?: MetadataDto[];
}

export class UpdateFormTemplateDto extends CreateFormTemplateDto {
  @IsOptional()
  @Type(() => Types.ObjectId)
  _id?: Types.ObjectId;
}
