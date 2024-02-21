import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { Asset } from '../entities/Asset.entity';
import { ICreateAsset } from '@modules/assets/interfaces/ICreateAsset';
import { UpdateAssetDto } from '@modules/assets/dto/UpdateInventaryDto';

export default interface IAssetRepository {
  create(data: ICreateAsset): Promise<Asset>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Asset | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: UpdateAssetDto): Promise<Asset>;
}
