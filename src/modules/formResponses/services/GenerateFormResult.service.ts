import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '../schemas/form_response.schema';

@Injectable()
export class GenerateFormResultService {
  constructor(
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
  ) {}

  async execute(id: string): Promise<any> {
    const formResponse = await this.formResponseModel.findById(id).exec();

    if (!formResponse) {
      throw new HttpException('Resposta de formulário não encontrada', 404);
    }

    const functionToCall = this.getFunctionToCall(formResponse);
    const result = functionToCall ? functionToCall(formResponse) : null;

    // Update the form response with the calculated results
    await this.formResponseModel.findByIdAndUpdate(id, {
      calculatedResults: result,
    });

    return this.formatResult(formResponse, result);
  }

  private getFunctionToCall(formResponse: FormResponseMongoDocument): any {
    const functionName = this.getFunctionName(formResponse);

    if (!functionName) {
      return null;
    }

    switch (functionName) {
      case 'processDenverII':
        return 1;
      // Add more cases for other form types here
      default:
        return null;
    }
  }

  private getFunctionName(
    formResponse: FormResponseMongoDocument,
  ): string | null {
    return (
      formResponse.metadata?.find((meta) => meta.key === 'function')?.value ||
      null
    );
  }

  private formatResult(
    formResponse: FormResponseMongoDocument,
    calculatedResult: any,
  ): any {
    return {
      formData: this.extractFormData(formResponse),
      calculatedResults: calculatedResult,
      metadata: formResponse.metadata || [],
    };
  }

  private extractFormData(formResponse: FormResponseMongoDocument): any {
    return {
      name: formResponse.name,
      description: formResponse.description,
      category: formResponse.category,
      sessions: formResponse.sessions?.map((session) => ({
        _id: session._id,
        name: session.name,
        description: session.description,
        fields: session.fields.map((field) => ({
          _id: field._id,
          name: field.name,
          description: field.description,
          type: field.type,
          label: field.label,
          validations: field.validations,
          weight: field.weight,
          options: field.options,
          order: field.order,
          content: field.content,
          metadata: field.metadata,
          response: field.response,
        })),
        order: session.order,
      })),
      rules: formResponse.rules,
      tags: formResponse.tags,
      createdBy: formResponse.createdBy,
      formTemplateId: formResponse.formTemplateId,
      respondentId: formResponse.respondentId,
      completedAt: formResponse.completedAt,
      lastUpdatedBy: formResponse.lastUpdatedBy,
    };
  }
}
