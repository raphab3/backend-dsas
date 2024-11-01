import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateFormAnswerArrayDto } from '../dto/update-form_answer-array.dto';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '../schemas/form_response.schema';

@Injectable()
export class UpdateFormResponseService {
  constructor(
    @InjectModel(FormResponseMongo.name)
    private readonly formAnswerModel: Model<FormResponseMongoDocument>,
  ) {}

  async update(
    id: string,
    updateformAnswerDto: UpdateFormAnswerArrayDto,
  ): Promise<void> {
    try {
      const bulkOperations = updateformAnswerDto.fields.map((field) => ({
        updateOne: {
          filter: { _id: id, 'fields._id': field._id },
          update: { $set: { 'fields.$.value': field.value } },
        },
      }));

      await this.formAnswerModel.bulkWrite(bulkOperations);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}
