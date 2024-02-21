import IInventaryRepository from './IInventaryRepository';
import { CreateSpecialtyDto } from '@modules/specialties/dto/create-Specialty.dto';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventary } from '../entities/Inventary.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class InventaryRepository implements IInventaryRepository {
  constructor(
    @InjectRepository(Inventary)
    private ormRepository: Repository<Inventary>,
  ) {}

  public async create(data: CreateSpecialtyDto): Promise<Inventary> {
    const Specialty = this.ormRepository.create(data);
    await this.ormRepository.save(Specialty);
    return Specialty;
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

  public async findOne(id: string): Promise<Inventary | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: CreateSpecialtyDto,
  ): Promise<Inventary> {
    const builder = this.ormRepository.createQueryBuilder();
    const inventary = await builder
      .update(Inventary)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return inventary.raw[0];
  }
}

export default InventaryRepository;
