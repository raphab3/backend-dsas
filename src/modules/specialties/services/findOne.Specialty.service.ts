import { Injectable } from '@nestjs/common';
import SpecialtyRepository from '../typeorm/repositories/SpecialtyRepository';

@Injectable()
export class FindOneSpecialtieservice {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}
  async findOne(id: string): Promise<any> {
    return this.specialtyRepository.findOne(id);
  }
}
