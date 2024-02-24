import { Injectable } from '@nestjs/common';
import DependentRepository from '../typeorm/repositories/DependentRepository';

@Injectable()
export class FindAllDependentService {
  constructor(private readonly dependentRepository: DependentRepository) {}

  async findAll(query: any): Promise<any> {
    return this.dependentRepository.list(query);
  }
}
