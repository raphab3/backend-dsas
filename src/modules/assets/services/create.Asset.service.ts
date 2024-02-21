import { Injectable } from '@nestjs/common';
import AssetRepository from '../typeorm/repositories/AssetRepository';

@Injectable()
export class CreateAssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  async execute(createAssetDto: any) {
    return await this.assetRepository.create(createAssetDto);
  }
}
