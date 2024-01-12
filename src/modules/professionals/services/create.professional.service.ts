import { Injectable } from '@nestjs/common';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';

@Injectable()
export class CreateProfessionalService {
  constructor(private readonly professionalRepository: ProfessionalRepository) {}

  async execute(createProfessionalDto: any) {
    const saved = await this.professionalRepository.create(createProfessionalDto);
    console.log('CreateProfessionalService -> saved', saved);
  }
}
