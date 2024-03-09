import { Injectable } from '@nestjs/common';
import DependentRepository from '../typeorm/repositories/DependentRepository';
import { IQueryDependents } from '../interfaces/IQueryDependents';

@Injectable()
export class FindAllDependentService {
  constructor(private readonly dependentRepository: DependentRepository) {}

  async findAll(query: IQueryDependents): Promise<any> {
    return this.dependentRepository.list(query);
  }
}
