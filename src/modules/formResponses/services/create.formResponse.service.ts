import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '../schemas/form_response.schema';
import { CreateFormResponseDto } from '../dto/create-form_response.dto';
import {
  FormTemplateMongo,
  FormTemplateMongoDocument,
} from '@modules/formsTemplates/schemas/forms_template.schema';

@Injectable()
export class CreateFormResponseService {
  constructor(
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateModel: Model<FormTemplateMongoDocument>,
  ) {}

  async execute(createFormResponseDto: CreateFormResponseDto) {
    const template = await this.formTemplateModel
      .findById(createFormResponseDto.templateId)
      .lean();
    if (!template) {
      throw new HttpException(
        `Template com id ${createFormResponseDto.templateId} não foi encontrado`,
        404,
      );
    }

    const formResponse = new this.formResponseModel({
      name: template.name,
      description: template.description,
      category: template.category,
      sessions: template.sessions.map((session) => ({
        ...session,
        fields: session.fields.map((field) => ({
          ...field,
          response: null,
        })),
      })),
      rules: template.rules,
      tags: template.tags,
      formTemplateId: template._id,
      respondentId: createFormResponseDto.createdBy,
      metadata: template.metadata,
    });

    return formResponse.save();
  }
}
