import IDependentRepository from './IDependentRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dependent } from '../entities/dependent.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { ICreateDependent } from '@modules/dependents/interfaces/ICreateDependent';
import { IQueryDependents } from '@modules/dependents/interfaces/IQueryDependents';
import { IUpdateDependent } from '@modules/dependents/interfaces/IUpdateDependent';

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

  public async list(query: IQueryDependents): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const dependentsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('dependents')
      .leftJoinAndSelect('dependents.person_sigs', 'person_sigs')
      .orderBy('dependents.created_at', 'DESC');

    if (query.id) {
      dependentsCreateQueryBuilder.andWhere('dependents.id = :id', {
        id: query.id,
      });
    }

    if (query.name) {
      dependentsCreateQueryBuilder.andWhere('dependents.name ILike :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.matricula) {
      dependentsCreateQueryBuilder.andWhere(
        'person_sigs.matricula ILike :matricula',
        {
          matricula: `%${query.matricula}%`,
        },
      );
    }

    if (query.cpf) {
      dependentsCreateQueryBuilder.where('dependents.cpf ILike :cpf', {
        cpf: `%${query.cpf}%`,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

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
    return this.ormRepository
      .createQueryBuilder('dependents')
      .leftJoinAndSelect('dependents.person_sigs', 'person_sigs')
      .leftJoinAndSelect('dependents.patients', 'patients')
      .leftJoinAndSelect('patients.appointments', 'appointments')
      .where('dependents.id = :id', { id })
      .getOne();
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: IUpdateDependent): Promise<Dependent> {
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
