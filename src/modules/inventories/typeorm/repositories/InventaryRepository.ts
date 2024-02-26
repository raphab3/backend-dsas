import IInventaryRepository from './IInventaryRepository';
import { CreateSpecialtyDto } from '@modules/specialties/dto/create-Specialty.dto';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../entities/Inventory.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class InventaryRepository implements IInventaryRepository {
  constructor(
    @InjectRepository(Inventory)
    private ormRepository: Repository<Inventory>,
  ) {}

  public async create(data: CreateSpecialtyDto): Promise<Inventory> {
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

  public async findOne(id: string): Promise<Inventory | undefined> {
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
  ): Promise<Inventory> {
    const builder = this.ormRepository.createQueryBuilder();
    const inventory = await builder
      .update(Inventory)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return inventory.raw[0];
  }
}

export default InventaryRepository;
