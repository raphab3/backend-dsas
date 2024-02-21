import { Injectable } from '@nestjs/common';
import AssetRepository from '../typeorm/repositories/AssetRepository';

@Injectable()
export class FindAllAssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  async findAll(query: any): Promise<any> {
    return this.assetRepository.list(query);
  }
}
