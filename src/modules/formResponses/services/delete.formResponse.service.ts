import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '../schemas/form_response.schema';

@Injectable()
export class DeleteFormResponseService {
  constructor(
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const result = await this.formResponseModel.findByIdAndDelete(id);

      if (!result) {
        throw new NotFoundException('Form response not found');
      }
    } catch (e) {
      console.error('Error deleting form response:', e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new HttpException('Error deleting form response', 500);
    }
  }
}
