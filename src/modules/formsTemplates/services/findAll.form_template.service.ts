import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Repository } from 'typeorm';
import { FormTemplate } from '../entities/forms_template.entity';
import { QueryFormTemplateDto } from '../dto/query-form_template.dto';

@Injectable()
export class FindAllFormTemplateService {
  constructor(
    @InjectRepository(FormTemplate)
    private attendanceTemplateRepository: Repository<FormTemplate>,
  ) {}

  async execute(
    query: QueryFormTemplateDto,
  ): Promise<IPaginatedResult<FormTemplate>> {
    return await this.list(query);
  }

  private async list(
    query: QueryFormTemplateDto,
  ): Promise<IPaginatedResult<FormTemplate>> {
    let page = 1;
    let perPage = 10;

    const attendanceTemplateCreateQueryBuilder =
      this.attendanceTemplateRepository
        .createQueryBuilder('form_templates')
        .orderBy('form_templates.created_at', 'DESC');

    const whereConditions: string[] = [];
    const parameters: Record<string, any> = {};

    if (query.id) {
      whereConditions.push('form_templates.id = :id');
      parameters.id = query.id;
    }

    if (query.name) {
      whereConditions.push('form_templates.name ILike :name');
      parameters.name = `%${query.name}%`;
    }

    if (whereConditions.length > 0) {
      attendanceTemplateCreateQueryBuilder.where(
        `(${whereConditions.join(' AND ')})`,
        parameters,
      );
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      attendanceTemplateCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }
}
