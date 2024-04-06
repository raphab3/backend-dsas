import IAuditRepository from './IAuditRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from '../entities/Audit.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { ICreateAudit } from '@modules/audits/dto/ICreateAudit';
import { IQueryAudit } from '@modules/audits/dto/IQueryAudit';

@Injectable()
class AuditRepository implements IAuditRepository {
  constructor(
    @InjectRepository(Audit)
    private ormRepository: Repository<Audit>,
  ) {}

  public async create(data: ICreateAudit): Promise<Audit> {
    const audit = this.ormRepository.create(data);
    await this.ormRepository.save(audit);
    return audit;
  }

  public async list(query: IQueryAudit): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const auditsCreateQueryBuilder =
      this.ormRepository.createQueryBuilder('audits');

    if (query.id) {
      auditsCreateQueryBuilder.where('audits.id = :id', {
        id: query.id,
      });
    }

    if (query.userId) {
      auditsCreateQueryBuilder.where('audits.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    auditsCreateQueryBuilder.orderBy('audits.created_at', 'DESC');

    const result: IPaginatedResult<any> = await paginate(
      auditsCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findOne(id: string): Promise<Audit | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: ICreateAudit): Promise<Audit> {
    const builder = this.ormRepository.createQueryBuilder();
    const audit = await builder
      .update(Audit)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return audit.raw[0];
  }
}

export default AuditRepository;
