import IPersonSigRepository from './IPersonSigRepository';
import { CreatePersonSigDto } from '@modules/persosnSig/dto/create-personSig.dto';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { PersonSig } from '../entities/personSig.entity';

@Injectable()
class PersonSigRepository implements IPersonSigRepository {
  constructor(
    @InjectRepository(PersonSig)
    private ormRepository: Repository<PersonSig>,
  ) {}

  public async create(data: CreatePersonSigDto): Promise<PersonSig> {
    const personSig = this.ormRepository.create(data);
    await this.ormRepository.save(personSig);
    return personSig;
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

  public async findOne(id: string): Promise<PersonSig | undefined> {
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
    data: CreatePersonSigDto,
  ): Promise<PersonSig> {
    const builder = this.ormRepository.createQueryBuilder();
    const personSig = await builder
      .update(PersonSig)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return personSig.raw[0];
  }
}

export default PersonSigRepository;
