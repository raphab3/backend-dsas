import { Injectable } from '@nestjs/common';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';

@Injectable()
export class FindAllProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}

  async findAll(query: any): Promise<any> {
    return this.professionalRepository.list(query);
  }
}
