import IPersonSigRepository from './IPersonSigRepository';
import { CreatePersonSigDto } from '@modules/persosnSig/dto/create-personSig.dto';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { PersonSig } from '../entities/personSig.entity';
import { UpdatePersonSigDto } from '@modules/persosnSig/dto/update-personSig.dto';
import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import { IQueryPersonSig } from '@modules/persosnSig/interfaces/IQueryPersonSig';

@Injectable()
class PersonSigRepository implements IPersonSigRepository {
  constructor(
    @InjectRepository(PersonSig)
    private ormRepository: Repository<PersonSig>,
  ) {}

  public async matriculaExists(matricula: string): Promise<boolean> {
    const personSig = await this.ormRepository
      .createQueryBuilder('person_sig')
      .where('matricula LIKE :matricula', { matricula: `%${matricula}%` })
      .getOne();
    return !!personSig;
  }

  public async create(data: CreatePersonSigDto): Promise<IPersonSig> {
    const personSig = this.ormRepository.create(data);
    await this.ormRepository.save(personSig);
    return personSig;
  }

  public async list(query: IQueryPersonSig): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const usersCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('users')
      .orderBy('users.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.nome) {
      where.nome = ILike(`%${query.nome}%`);
    }

    if (query.matricula) {
      where.matricula = ILike(`%${query.matricula}%`);
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

  public async findByMatricula(
    matricula: string,
  ): Promise<PersonSig | undefined> {
    return await this.ormRepository
      .createQueryBuilder('person_sig')
      .leftJoinAndSelect('person_sig.dependents', 'dependents')
      .where('matricula LIKE :matricula', { matricula: `%${matricula}%` })
      .getOne();
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: UpdatePersonSigDto,
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
