import ISpecialtyRepository from './ISpecialtyRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Specialty } from '../entities/Specialty.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { CreateSpecialtyDto } from '@modules/specialties/dto/create-Specialty.dto';

@Injectable()
class SpecialtyRepository implements ISpecialtyRepository {
  constructor(
    @InjectRepository(Specialty)
    private ormRepository: Repository<Specialty>,
  ) {}

  public async create(data: CreateSpecialtyDto): Promise<Specialty> {
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

  public async findOne(id: string): Promise<Specialty | undefined> {
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
  ): Promise<Specialty> {
    const builder = this.ormRepository.createQueryBuilder();
    const specialty = await builder
      .update(Specialty)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return specialty.raw[0];
  }
}

export default SpecialtyRepository;
