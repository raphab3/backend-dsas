import IDependentRepository from './IDependentRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Dependent } from '../entities/dependent.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { ICreateDependent } from '@modules/dependents/interfaces/ICreateDependent';

@Injectable()
class DependentRepository implements IDependentRepository {
  constructor(
    @InjectRepository(Dependent)
    private ormRepository: Repository<Dependent>,
  ) {}

  public async create(data: ICreateDependent): Promise<Dependent> {
    const dependent = this.ormRepository.create(data);
    await this.ormRepository.save(dependent);
    return dependent;
  }

  public async list(query: any): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const dependentsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('dependents')
      .leftJoinAndSelect('dependents.person_sigs', 'person_sigs')
      .orderBy('dependents.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    dependentsCreateQueryBuilder.where(where);

    const result: IPaginatedResult<any> = await paginate(
      dependentsCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findOne(id: string): Promise<Dependent | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: ICreateDependent): Promise<Dependent> {
    const builder = this.ormRepository.createQueryBuilder();
    const dependent = await builder
      .update(Dependent)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return dependent.raw[0];
  }
}

export default DependentRepository;
