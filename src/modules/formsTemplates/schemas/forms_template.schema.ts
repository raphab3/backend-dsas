import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import {
  ConditionType,
  FieldType,
  OperationType,
  FormCategory,
  RuleType,
} from '../types';

@Schema({ _id: false })
class DocumentVariable {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true, enum: ['field', 'custom'] })
  type: string;

  @Prop({ required: false })
  fieldReference?: string;
}

@Schema({ _id: false })
class DocumentConfig {
  @Prop({ required: false })
  documentType?: string;

  @Prop({ required: false, enum: ['portrait', 'landscape'] })
  orientation?: string;

  @Prop({ type: [DocumentVariable], required: false, default: [] })
  variables: DocumentVariable[];

  @Prop({ type: [String], required: false, default: [] })
  customVariables: string[];

  @Prop({
    required: false,
    type: {
      header: String,
      footer: String,
      margins: {
        top: Number,
        right: Number,
        bottom: Number,
        left: Number,
      },
      fontSize: Number,
      fontFamily: String,
    },
  })
  metadata?: {
    header?: string;
    footer?: string;
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    fontSize?: number;
    fontFamily?: string;
  };
}

@Schema({ _id: false })
class ValidationSchema {
  @Prop({ required: true })
  required: boolean;

  @Prop({ required: false })
  min?: number;

  @Prop({ required: false })
  max?: number;
}

@Schema({ _id: false })
class MetadataSchema {
  @Prop({ required: true })
  key: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.Mixed,
  })
  value: string | number;
}

@Schema({ _id: false })
class FieldOption {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id?: Types.ObjectId;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  value: string | number;

  @Prop({ required: false })
  score?: number;

  @Prop({ required: false })
  weight?: number;
}

@Schema()
class FieldSchema {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true, enum: FieldType })
  type: FieldType;

  @Prop({ required: true })
  label: string;

  @Prop({ type: ValidationSchema, required: true })
  validations: ValidationSchema;

  @Prop({ required: false })
  weight?: number;

  @Prop({ type: [FieldOption], required: false })
  options?: FieldOption[];

  @Prop({ required: true })
  order: number;

  @Prop({ type: DocumentConfig, required: false })
  documentConfig?: DocumentConfig;

  @Prop({ required: false })
  content?: string;

  @Prop({ type: [MetadataSchema], required: true })
  metadata: MetadataSchema[];
}

@Schema()
class SessionSchema {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [FieldSchema], required: true })
  fields: FieldSchema[];

  @Prop({ required: false })
  order?: number;
}

@Schema({ _id: false })
class CalculationSchema {
  @Prop({ required: true, enum: OperationType })
  operation: OperationType;

  @Prop({ type: [String], required: true })
  sourceFields: string[];
}

@Schema({ _id: false })
class ConditionSchema {
  @Prop({ required: true })
  sourceRuleId: string;

  @Prop({ required: true, enum: ConditionType })
  operator: ConditionType;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  value: number | string;
}

@Schema()
class RuleSchema {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: RuleType })
  type: RuleType;

  @Prop({ type: CalculationSchema, required: false })
  calculation?: CalculationSchema;

  @Prop({ type: ConditionSchema, required: false })
  condition?: ConditionSchema;

  @Prop({ required: false })
  result?: string;
}

@Schema({ collection: 'form_templates', timestamps: true })
export class FormTemplateMongo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, enum: FormCategory })
  category: FormCategory;

  @Prop({ type: [SessionSchema], required: false })
  sessions?: SessionSchema[];

  @Prop({ type: [RuleSchema], required: false })
  rules?: RuleSchema[];

  @Prop({ type: [String], required: false })
  tags?: string[];

  @Prop({ required: false })
  createdBy?: string;

  @Prop({ required: false, default: false })
  isPublished?: boolean;

  @Prop({ type: [MetadataSchema], required: false })
  metadata?: MetadataSchema[];
}

export type FormTemplateMongoDocument = FormTemplateMongo & Document;
export const FormTemplateMongoSchema =
  SchemaFactory.createForClass(FormTemplateMongo);
