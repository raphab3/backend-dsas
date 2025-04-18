import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cid } from '../entities/cid.entity';
import { QueryCidDto } from '../dto/query-cid.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
export class FindAllCidsService {
  private readonly logger = new Logger(FindAllCidsService.name);

  constructor(
    @InjectRepository(Cid)
    private cidRepository: Repository<Cid>,
  ) {}

  async execute(query: QueryCidDto): Promise<IPaginatedResult<Cid>> {
    const { search, page = 1, perPage = 10 } = query;

    const queryBuilder = this.cidRepository.createQueryBuilder('cid');
    queryBuilder.orderBy('cid.description', 'ASC');

    if (search) {
      queryBuilder.where(
        'cid.code ILIKE :search OR cid.description ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (search) {
      return paginate(queryBuilder, {
        page,
        perPage,
      });
    }

    return paginate(queryBuilder, {
      page,
      perPage,
    });
  }
}
