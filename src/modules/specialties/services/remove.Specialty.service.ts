import { Injectable } from '@nestjs/common';
import SpecialtyRepository from '../typeorm/repositories/SpecialtyRepository';

@Injectable()
export class RemoveSpecialtieservice {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}
  remove(id: string) {
    return this.specialtyRepository.delete(id);
  }
}
