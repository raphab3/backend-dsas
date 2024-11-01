import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Repository } from 'typeorm';
import { GroupFormTemplate } from '../entities/groupFormTemplate.entity';
import { QueryGroupFormTemplateDto } from '../dto/query-groupFormTemplate.dto';

@Injectable()
export class FindAllGroupFormTemplateService {
  constructor(
    @InjectRepository(GroupFormTemplate)
    private groupFormTemplateRepository: Repository<GroupFormTemplate>,
  ) {}

  async execute(
    query: QueryGroupFormTemplateDto,
  ): Promise<IPaginatedResult<GroupFormTemplate>> {
    let page = 1;
    let perPage = 10;

    const groupFormTemplateCreateQueryBuilder = this.groupFormTemplateRepository
      .createQueryBuilder('groupFormTemplates')
      .leftJoinAndSelect('groupFormTemplates.templates', 'templates')
      .leftJoinAndSelect('groupFormTemplates.specialties', 'specialties')
      .leftJoinAndSelect('groupFormTemplates.roles', 'roles')
      .orderBy('groupFormTemplates.created_at', 'DESC');

    if (query.id) {
      groupFormTemplateCreateQueryBuilder.where('groupFormTemplates.id = :id', {
        id: query.id,
      });
    }

    if (query.name) {
      groupFormTemplateCreateQueryBuilder.andWhere(
        'groupFormTemplates.name ILike :name',
        {
          name: `%${query.name}%`,
        },
      );
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      groupFormTemplateCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }
}
