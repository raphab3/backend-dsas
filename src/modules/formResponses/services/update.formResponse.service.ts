import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '../schemas/form_response.schema';

@Injectable()
export class UpdateFormResponseService {
  constructor(
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
  ) {}

  async execute(
    id: string,
    data: { fieldUpdates: { fieldId: string; value: any }[] },
  ) {
    try {
      const formResponse = await this.formResponseModel.findById(id);
      if (!formResponse) {
        throw new HttpException('Form response not found', 404);
      }

      for (const update of data.fieldUpdates) {
        const session = formResponse.sessions.find((s) =>
          s.fields.some((f) => f.name === update.fieldId),
        );

        if (session) {
          const field = session.fields.find((f) => f.name === update.fieldId);
          if (field) {
            console.log('Processing field update:', {
              fieldName: field.name,
              fieldType: field.type,
              currentResponse: field.response,
              updateValue: update.value,
            });

            if (field.type === 'document_template') {
              const existingVariables = field.response?.variables || {};

              if (typeof update.value === 'object') {
                field.content = update.value.content || field.content;
                field.response = {
                  content: update.value.content || field.content,
                  variables: {
                    ...existingVariables,
                    ...(update.value.variables || {}),
                  },
                };
              } else {
                field.content = update.value;
                field.response = {
                  content: update.value,
                  variables: existingVariables,
                };
              }

              console.log('Updated document field state:', {
                content: field.content.substring(0, 100) + '...',
                variables: field.response.variables,
              });
            } else {
              field.response = update.value;
            }
          }
        }
      }

      const updatedResponse = await formResponse.save();
      console.log('Successfully updated form response');
      return updatedResponse;
    } catch (error) {
      console.error('Error in UpdateFormResponseService:', error);
      throw new HttpException(
        error.message || 'Error updating form response',
        error.status || 400,
      );
    }
  }
}
