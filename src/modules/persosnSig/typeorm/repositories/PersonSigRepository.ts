import IPersonSigRepository from './IPersonSigRepository';
import { CreatePersonSigDto } from '@modules/persosnSig/dto/create-personSig.dto';
import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { PersonSig } from '../entities/personSig.entity';
import { UpdatePersonSigDto } from '@modules/persosnSig/dto/update-personSig.dto';
import {
  IPersonSig,
  OriginType,
} from '@modules/persosnSig/interfaces/IPersonSig';
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

    const personSigCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('person_sig')
      .leftJoinAndSelect('person_sig.locations', 'locations')
      .orderBy('person_sig.created_at', 'DESC');

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

    personSigCreateQueryBuilder.where(where);

    const result: IPaginatedResult<any> = await paginate(
      personSigCreateQueryBuilder,
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

  public async findLastMatriculaByOrigin(
    tipo_servidor: OriginType,
  ): Promise<IPersonSig> {
    const personSig = await this.ormRepository
      .createQueryBuilder('person_sig')
      .where('tipo_servidor = :tipo_servidor', { tipo_servidor })
      .andWhere('person_sig.matricula IS NOT NULL')
      .orderBy('person_sig.matricula', 'DESC')
      .addOrderBy('person_sig.created_at', 'DESC')
      .getOne();

    return personSig;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: UpdatePersonSigDto,
  ): Promise<PersonSig> {
    const builder = this.ormRepository
      .createQueryBuilder('person_sig')
      .leftJoinAndSelect('person_sig.locations', 'locations')
      .where('person_sig.id = :id', { id })
      .getOne();

    const personSig = await builder;
    if (!personSig) {
      throw new Error('PersonSig not found');
    }

    Object.assign(personSig, data);

    console.log('personSig: ', personSig);

    await this.ormRepository.save(personSig);

    return personSig;
  }
}

export default PersonSigRepository;
