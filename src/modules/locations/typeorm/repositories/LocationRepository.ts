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
      .leftJoinAndSelect('locations.professionals', 'professionals')
      .orderBy('locations.name', 'ASC');

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

    if (query.description) {
      locationsCreateQueryBuilder.andWhere(
        'locations.description ILike :description',
        {
          description: `%${query.description}%`,
        },
      );
    }

    if (query.city) {
      locationsCreateQueryBuilder.andWhere('locations.city = :city', {
        city: query.city,
      });
    }

    if (query.person_sig_id) {
      locationsCreateQueryBuilder.andWhere('person_sigs.id = :person_sig_id', {
        person_sig_id: query.person_sig_id,
      });
    }

    if (query.professional_id) {
      locationsCreateQueryBuilder.andWhere(
        'professionals.id = :professional_id',
        {
          professional_id: query.professional_id,
        },
      );
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

    const formattedData = result.data.map((location) => ({
      id: location.id,
      name: location.name,
      description: location.description,
      city: location.city,
      created_at: location.created_at,
      updated_at: location.updated_at,
    }));

    return {
      data: formattedData,
      pagination: result.pagination,
    };
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
    const createdLocation = this.ormRepository.create(data);
    const location = await builder
      .update(Location)
      .set(createdLocation)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return location.raw[0];
  }
}

export default LocationRepository;
