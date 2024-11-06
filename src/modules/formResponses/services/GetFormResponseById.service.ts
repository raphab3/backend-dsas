import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '../schemas/form_response.schema';

@Injectable()
export class GetFormResponseByIdService {
  constructor(
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
  ) {}

  async execute(id: string): Promise<FormResponseMongoDocument | null> {
    const responseTemplate = await this.formResponseModel.findById(id).exec();

    if (!responseTemplate) {
      throw new HttpException(`FormResponse with id ${id} not found`, 404);
    }

    return responseTemplate;
  }
}
