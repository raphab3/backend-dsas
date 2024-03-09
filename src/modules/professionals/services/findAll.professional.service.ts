import { Injectable } from '@nestjs/common';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';
import { IQueryProfessional } from '../interfaces/IQueryProfessional';

@Injectable()
export class FindAllProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}

  async findAll(query: IQueryProfessional): Promise<any> {
    return this.professionalRepository.list(query);
  }
}
