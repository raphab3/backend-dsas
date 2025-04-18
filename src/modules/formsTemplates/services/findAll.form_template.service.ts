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

    const formTemplateQueryBuilder = this.attendanceTemplateRepository
      .createQueryBuilder('form_templates')
      .leftJoinAndSelect('form_templates.location', 'location')
      .orderBy('form_templates.created_at', 'DESC');

    if (query.id) {
      formTemplateQueryBuilder.where(`form_templates.id = '${query.id}'`);
    }

    if (query.name) {
      formTemplateQueryBuilder.andWhere(
        `form_templates.name ILIKE '%${query.name}%'`,
      );
    }

    if (query.is_published) {
      formTemplateQueryBuilder.andWhere(
        `form_templates.is_published = ${query.is_published}`,
      );
    }

    if (query.type) {
      formTemplateQueryBuilder.andWhere(
        `form_templates.type = '${query.type}'`,
      );
    }

    if (query.location_id) {
      formTemplateQueryBuilder.andWhere(
        `(form_templates.location_id = :locationId OR form_templates.is_global = true)`,
        {
          locationId: query.location_id,
        },
      );
    }

    if (query.category) {
      formTemplateQueryBuilder.andWhere(
        `form_templates.category = '${query.category}'`,
      );
    }

    if (query.is_global !== undefined) {
      formTemplateQueryBuilder.andWhere(
        `form_templates.is_global = :isGlobal`,
        {
          isGlobal: query.is_global,
        },
      );
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      formTemplateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }
}
