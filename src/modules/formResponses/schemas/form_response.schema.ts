import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class FieldResponse {
  @Prop({ required: true })
  fieldId: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: false })
  score?: number;
}

@Schema({ _id: false })
class CalculatedResult {
  @Prop({ required: true })
  ruleId: string;

  @Prop({ required: true })
  result: string;
}

@Schema({ collection: 'form_responses', timestamps: true })
export class FormResponseMongo {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'FormTemplateMongo',
    index: true,
  })
  templateId: string;

  @Prop({ required: true, index: true })
  respondentId: string;

  @Prop({ type: [FieldResponse], required: true })
  responses: FieldResponse[];

  @Prop({ type: [CalculatedResult], required: false })
  calculatedResults?: CalculatedResult[];

  @Prop({ type: Number, required: false })
  totalScore?: number;

  @Prop({ default: false, index: true })
  isCompleted: boolean;

  @Prop({ type: Date, index: true })
  submittedAt?: Date;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;
}

export type FormResponseMongoDocument = FormResponseMongo & Document;
export const FormResponseMongoSchema =
  SchemaFactory.createForClass(FormResponseMongo);

// Índices compostos para melhorar a performance de consultas comuns
FormResponseMongoSchema.index({ templateId: 1, respondentId: 1 });
FormResponseMongoSchema.index({ templateId: 1, isCompleted: 1 });
FormResponseMongoSchema.index({ submittedAt: 1, templateId: 1 });
