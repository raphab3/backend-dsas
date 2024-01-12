import IProfessionalRepository from './IProfessionalRepository';
import { CreateProfessionalDto } from '@modules/professionals/dto/create-professional.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Professional } from '../entities/professional.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class ProfessionalRepository implements IProfessionalRepository {
  constructor(
    @InjectRepository(Professional)
    private ormRepository: Repository<Professional>,
  ) {}

  public async create(data: CreateProfessionalDto): Promise<Professional> {
    const professional = this.ormRepository.create(data);
    await this.ormRepository.save(professional);
    return professional;
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

  public async findOne(id: string): Promise<Professional | undefined> {
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
    data: CreateProfessionalDto,
  ): Promise<Professional> {
    const builder = this.ormRepository.createQueryBuilder();
    const professional = await builder
      .update(Professional)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return professional.raw[0];
  }
}

export default ProfessionalRepository;
