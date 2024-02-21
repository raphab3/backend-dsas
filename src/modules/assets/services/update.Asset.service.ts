import { Injectable } from '@nestjs/common';
import AssetRepository from '../typeorm/repositories/AssetRepository';
import { CreateAssetDto } from '../dto/CreateAssetDto';

@Injectable()
export class UpdateAssetService {
  constructor(private readonly assetRepository: AssetRepository) {}
  update(id: string, updateAssetDto: CreateAssetDto) {
    return this.assetRepository.update(id, updateAssetDto);
  }
}
