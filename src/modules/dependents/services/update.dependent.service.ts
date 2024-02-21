import { Injectable } from '@nestjs/common';
import DependentRepository from '../typeorm/repositories/DependentRepository';
import { ICreateDependent } from '../interfaces/ICreateDependent';

@Injectable()
export class UpdateDependentService {
  constructor(private readonly dependentRepository: DependentRepository) {}
  update(id: string, updateDependentDto: ICreateDependent) {
    return this.dependentRepository.update(id, updateDependentDto);
  }
}
