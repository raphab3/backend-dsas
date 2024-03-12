import { Injectable } from '@nestjs/common';
import SpecialtyRepository from '../typeorm/repositories/SpecialtyRepository';
import { IQuerySpecialty } from '../interfaces/IQuerySpecialty';

@Injectable()
export class FindAllSpecialtieservice {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}

  async findAll(query: IQuerySpecialty): Promise<any> {
    return this.specialtyRepository.list(query);
  }
}
