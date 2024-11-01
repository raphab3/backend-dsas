import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { QueryTemplateDto } from '../dto/query-template.dto';

@Injectable()
export class FindAllTemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async execute(query: QueryTemplateDto): Promise<IPaginatedResult<Template>> {
    let page = 1;
    let perPage = 10;

    const templateCreateQueryBuilder = this.templateRepository
      .createQueryBuilder('templates')
      .orderBy('templates.created_at', 'DESC');

    if (query.id) {
      templateCreateQueryBuilder.where('templates.id = :id', { id: query.id });
    }

    if (query.name) {
      templateCreateQueryBuilder.where('templates.name ILike :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      templateCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }
}
