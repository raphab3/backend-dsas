import {
  FieldType,
  OperationType,
  ConditionType,
  RuleType,
  FormCategory,
} from '@modules/formsTemplates/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

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
  value: any;
}

@Schema({ _id: false })
class FieldOption {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

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
class FieldResponseSchema {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

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

  @Prop({ required: false })
  content?: string;

  @Prop({ type: [MetadataSchema], required: true })
  metadata: MetadataSchema[];

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  response?: any;
}

@Schema()
class SessionResponseSchema {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [FieldResponseSchema], required: true })
  fields: FieldResponseSchema[];

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
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

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

@Schema({ collection: 'form_responses', timestamps: true })
export class FormResponseMongo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, enum: FormCategory })
  category: FormCategory;

  @Prop({ type: [SessionResponseSchema], required: false })
  sessions?: SessionResponseSchema[];

  @Prop({ type: [RuleSchema], required: false })
  rules?: RuleSchema[];

  @Prop({ type: [String], required: false })
  tags?: string[];

  @Prop({ required: false })
  createdBy?: string;

  @Prop({ required: true, ref: 'FormTemplateMongo' })
  formTemplateId: Types.ObjectId;

  @Prop({ required: true })
  respondentId: string;

  @Prop({ required: false })
  completedAt?: Date;

  @Prop({ required: false })
  lastUpdatedBy?: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  calculatedResults?: any;

  @Prop({ type: [MetadataSchema], required: false })
  metadata?: MetadataSchema[];
}

export type FormResponseMongoDocument = FormResponseMongo & Document;
export const FormResponseMongoSchema =
  SchemaFactory.createForClass(FormResponseMongo);

// Índices compostos para melhorar a performance de consultas comuns
FormResponseMongoSchema.index({ templateId: 1, respondentId: 1 });
FormResponseMongoSchema.index({ templateId: 1, isCompleted: 1 });
FormResponseMongoSchema.index({ submittedAt: 1, templateId: 1 });
