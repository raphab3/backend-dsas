import IAssetRepository from './IAssetRepository';
import { Asset } from '../entities/Asset.entity';
import { ICreateAsset } from '@modules/assets/interfaces/ICreateAsset';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class AssetRepository implements IAssetRepository {
  constructor(
    @InjectRepository(Asset)
    private ormRepository: Repository<Asset>,
  ) {}

  public async create(data: ICreateAsset): Promise<Asset> {
    const asset = this.ormRepository.create(data);
    await this.ormRepository.save(asset);
    return asset;
  }

  public async list(query: any): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const usersCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('users')
      .orderBy('users.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    usersCreateQueryBuilder.where(where);

    const result: IPaginatedResult<any> = await paginate(
      usersCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findOne(id: string): Promise<Asset | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: any): Promise<Asset> {
    const builder = this.ormRepository.createQueryBuilder();
    const asset = await builder
      .update(Asset)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return asset.raw[0];
  }
}

export default AssetRepository;
