import ISpecialtyRepository from './ISpecialtyRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../entities/Specialty.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { CreateSpecialtyDto } from '@modules/specialties/dto/create-Specialty.dto';
import { IQuerySpecialty } from '@modules/specialties/interfaces/IQuerySpecialty';

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

  public async list(query: IQuerySpecialty): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const specialtyCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('specialty')
      .orderBy('specialty.created_at', 'DESC');

    if (query.id) {
      specialtyCreateQueryBuilder.where('specialty.id = :id', { id: query.id });
    }

    if (query.name) {
      const name = query.name.toLowerCase();
      console.log(query.name);
      specialtyCreateQueryBuilder.where('LOWER(specialty.name) LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (query.formation) {
      try {
        specialtyCreateQueryBuilder.where(
          '(specialty.formation) = :formation',
          {
            formation: query.formation,
          },
        );
      } catch (error) {
        console.log(error);
      }
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      specialtyCreateQueryBuilder,
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
    const specialtyData = this.ormRepository.create(data);
    const specialty = await builder
      .update(Specialty)
      .set(specialtyData)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return specialty.raw[0];
  }
}

export default SpecialtyRepository;
