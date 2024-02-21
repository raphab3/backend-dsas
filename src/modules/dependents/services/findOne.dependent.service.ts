import { Injectable } from '@nestjs/common';
import DependentRepository from '../typeorm/repositories/DependentRepository';

@Injectable()
export class FindOneDependentService {
  constructor(private readonly dependentRepository: DependentRepository) {}
  async findOne(id: string): Promise<any> {
    return this.dependentRepository.findOne(id);
  }
}
