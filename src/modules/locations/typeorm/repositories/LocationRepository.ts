import ILocationRepository from './ILocationRepository';
import { ICreateLocation } from '@modules/locations/interfaces/ILocation';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { Location } from '../entities/location.entity';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class LocationRepository implements ILocationRepository {
  constructor(
    @InjectRepository(Location)
    private ormRepository: Repository<Location>,
  ) {}

  public async create(data: ICreateLocation): Promise<Location> {
    const location = this.ormRepository.create({
      name: data.name,
      description: data.description,
      city: data.city,
    });
    await this.ormRepository.save(location);
    return location;
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

  public async findOne(id: string): Promise<Location | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: ICreateLocation): Promise<Location> {
    const builder = this.ormRepository.createQueryBuilder();
    const location = await builder
      .update(Location)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return location.raw[0];
  }
}

export default LocationRepository;
