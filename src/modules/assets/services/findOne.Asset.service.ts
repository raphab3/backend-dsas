import { Injectable } from '@nestjs/common';
import AssetRepository from '../typeorm/repositories/AssetRepository';

@Injectable()
export class FindOneAssetService {
  constructor(private readonly assetRepository: AssetRepository) {}
  async findOne(id: string): Promise<any> {
    return this.assetRepository.findOne(id);
  }
}
