import { Injectable } from '@nestjs/common';
import SpecialtyRepository from '../typeorm/repositories/SpecialtyRepository';

@Injectable()
export class CreateSpecialtieservice {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}

  async execute(createSpecialtyDto: any) {
    await this.specialtyRepository.create(createSpecialtyDto);
  }
}
