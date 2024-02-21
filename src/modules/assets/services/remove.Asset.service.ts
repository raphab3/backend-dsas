import { Injectable } from '@nestjs/common';
import AssetRepository from '../typeorm/repositories/AssetRepository';

@Injectable()
export class RemoveAssetService {
  constructor(private readonly assetRepository: AssetRepository) {}
  remove(id: string) {
    return this.assetRepository.delete(id);
  }
}
