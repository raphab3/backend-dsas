import ILocationRepository from './ILocationRepository';
import { ICreateLocation } from '@modules/locations/interfaces/ILocation';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { Location } from '../entities/location.entity';
import { paginate } from '@shared/utils/Pagination';
import { IQueryLocations } from '@modules/locations/interfaces/IQueryLocations';

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

  public async list(query: IQueryLocations): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const locationsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('locations')
      .leftJoinAndSelect('locations.person_sigs', 'person_sigs')
      .leftJoinAndSelect('person_sigs.user', 'user')
      .orderBy('locations.created_at', 'DESC');

    if (query.id) {
      locationsCreateQueryBuilder.where({
        id: query.id,
      });
    }

    if (query.name) {
      locationsCreateQueryBuilder.andWhere('locations.name ILike :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.person_sig_id) {
      locationsCreateQueryBuilder.andWhere('person_sigs.id = :person_sig_id', {
        person_sig_id: query.person_sig_id,
      });
    }

    if (query.userId) {
      locationsCreateQueryBuilder.andWhere('user.id = :userId', {
        userId: query.userId,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      locationsCreateQueryBuilder,
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
