import { Injectable } from '@nestjs/common';
import { UpdateSpecialtyDto } from '../dto/update-Specialty.dto';
import SpecialtyRepository from '../typeorm/repositories/SpecialtyRepository';

@Injectable()
export class UpdateSpecialtieservice {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}
  update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {
    return this.specialtyRepository.update(id, updateSpecialtyDto);
  }
}
