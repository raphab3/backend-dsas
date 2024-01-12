import { Injectable } from '@nestjs/common';
import SpecialtyRepository from '../typeorm/repositories/SpecialtyRepository';

@Injectable()
export class FindAllSpecialtieservice {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}

  async findAll(query: any): Promise<any> {
    return this.specialtyRepository.list(query);
  }
}
