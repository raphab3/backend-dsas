import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { Repository } from 'typeorm';
import { GroupFormTemplate } from '../entities/groupFormTemplate.entity';
import { QueryGroupFormTemplateDto } from '../dto/query-groupFormTemplate.dto';

interface IExecuteParams {
  query: QueryGroupFormTemplateDto;
}

@Injectable()
export class FindAllProfessionalGroupFormTemplateService {
  constructor(
    @InjectRepository(GroupFormTemplate)
    private groupFormTemplateRepository: Repository<GroupFormTemplate>,
  ) {}

  async execute({
    query,
  }: IExecuteParams): Promise<IPaginatedResult<GroupFormTemplate>> {
    let page = 1;
    let perPage = 10;

    const groupFormTemplateQueryBuilder = this.groupFormTemplateRepository
      .createQueryBuilder('groupFormTemplates')
      .leftJoinAndSelect('groupFormTemplates.templates', 'templates')
      .leftJoinAndSelect('groupFormTemplates.specialties', 'specialties')
      .leftJoinAndSelect('groupFormTemplates.roles', 'roles')
      .andWhere('groupFormTemplates.isActive = :isActive', { isActive: true })
      .orderBy('groupFormTemplates.created_at', 'DESC');

    // Aplicar filtros adicionais
    if (query.id) {
      groupFormTemplateQueryBuilder.andWhere('groupFormTemplates.id = :id', {
        id: query.id,
      });
    }

    if (query.name) {
      groupFormTemplateQueryBuilder.andWhere(
        'groupFormTemplates.name ILike :name',
        {
          name: `%${query.name}%`,
        },
      );
    }

    // Filtrar por specialties se houver IDs fornecidos
    if (
      query.professionalSpecialtyIds &&
      query.professionalSpecialtyIds.length > 0
    ) {
      groupFormTemplateQueryBuilder.andWhere(
        'specialties.id IN (:...specialtyIds)',
        {
          specialtyIds: query.professionalSpecialtyIds,
        },
      );
    }

    // Filtrar por roles se houver IDs fornecidos
    if (query.professionalRoleIds && query.professionalRoleIds.length > 0) {
      groupFormTemplateQueryBuilder.andWhere('roles.id IN (:...roleIds)', {
        roleIds: query.professionalRoleIds,
      });
    }

    // Configurar paginação
    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    return paginate(groupFormTemplateQueryBuilder, {
      page,
      perPage,
    });
  }
}
