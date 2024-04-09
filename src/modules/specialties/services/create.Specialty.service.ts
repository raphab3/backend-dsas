import { Injectable } from '@nestjs/common';
import SpecialtyRepository from '../typeorm/repositories/SpecialtyRepository';
import { CreateSpecialtyDto } from '../dto/create-Specialty.dto';

@Injectable()
export class CreateSpecialtieservice {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}

  async execute(createSpecialtyDto: CreateSpecialtyDto) {
    await this.specialtyRepository.create({
      name: createSpecialtyDto.name,
      formation: createSpecialtyDto.formation,
    });
  }
}
