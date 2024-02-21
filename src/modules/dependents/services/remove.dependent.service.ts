import { Injectable } from '@nestjs/common';
import DependentRepository from '../typeorm/repositories/DependentRepository';

@Injectable()
export class RemoveDependentService {
  constructor(private readonly dependentRepository: DependentRepository) {}
  remove(id: string) {
    return this.dependentRepository.delete(id);
  }
}
