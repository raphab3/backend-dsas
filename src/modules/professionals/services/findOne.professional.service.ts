import { Injectable } from '@nestjs/common';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';

@Injectable()
export class FindOneProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  async findOne(id: string): Promise<any> {
    return this.professionalRepository.findOne(id);
  }
}
