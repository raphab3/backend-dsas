import { Injectable } from '@nestjs/common';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';

@Injectable()
export class RemoveProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  remove(id: string) {
    return this.professionalRepository.delete(id);
  }
}
