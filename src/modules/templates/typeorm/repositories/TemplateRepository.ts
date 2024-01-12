import ITemplateRepository from './ITemplateRepository';
import { CreateTemplateDto } from '@modules/templates/dto/create-template.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class TemplateRepository implements ITemplateRepository {
  constructor(
    @InjectRepository(Template)
    private ormRepository: Repository<Template>,
  ) {}

  public async create(data: CreateTemplateDto): Promise<Template> {
    const template = this.ormRepository.create(data);
    await this.ormRepository.save(template);
    return template;
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

  public async findOne(id: string): Promise<Template | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: CreateTemplateDto): Promise<Template> {
    const builder = this.ormRepository.createQueryBuilder();
    const template = await builder
      .update(Template)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return template.raw[0];
  }
}

export default TemplateRepository;
