import { Injectable, HttpException } from '@nestjs/common';
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

      if (!Array.isArray(data.fieldUpdates)) {
        throw new HttpException('Invalid fieldUpdates format', 400);
      }

      for (const update of data.fieldUpdates) {
        const session = formResponse.sessions.find((s) =>
          s.fields.some((f) => f.name === update.fieldId),
        );
        if (session) {
          const field = session.fields.find((f) => f.name === update.fieldId);
          if (field) {
            field.response = update.value;
          }
        }
      }

      await formResponse.save();
    } catch (e) {
      console.error('Error updating form response:', e);
      throw new HttpException(e.message, 400);
    }
  }
}
