import {
  IPaginatedResult,
  IPaginationOptions,
} from '@shared/interfaces/IPaginations';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<IPaginatedResult<T>> {
  const [results, total] = await queryBuilder
    .skip((options.page - 1) * options.perPage)
    .take(options.perPage)
    .getManyAndCount();

  return {
    data: results,
    pagination: {
      total,
      page: options.page,
      perPage: options.perPage,
      lastPage: Math.ceil(total / options.perPage),
    },
  };
}
