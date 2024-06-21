import { Injectable } from '@nestjs/common';
import { IQueryAudit } from '../dto/IQueryAudit';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from '../typeorm/entities/Audit.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
export class FindAllAuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async findAll(query: IQueryAudit): Promise<any> {
    try {
      const audits = await this.list(query);
      return audits;
    } catch (error) {
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          perPage: 10,
        },
      };
    }
  }

  private async list(query: IQueryAudit): Promise<IPaginatedResult<Audit>> {
    let page = 1;
    let perPage = 10;

    const usersCreateQueryBuilder = this.auditRepository
      .createQueryBuilder('audit')
      .orderBy('audit.created_at', 'DESC');

    if (query.id) {
      usersCreateQueryBuilder.andWhere('audit.id = :id', { id: query.id });
    }

    if (query.userId) {
      usersCreateQueryBuilder.andWhere('audit.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<Audit> = await paginate(
      usersCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }
}
