import { Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';
import { IQueryPersonSig } from '../interfaces/IQueryPersonSig';
import { IPersonSig } from '../interfaces/IPersonSig';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

@Injectable()
export class FindAllPersonSigService {
  constructor(private readonly personSigRepository: PersonSigRepository) {}

  async findAll(query: IQueryPersonSig): Promise<IPaginatedResult<IPersonSig>> {
    return await this.personSigRepository.list(query);
  }
}
