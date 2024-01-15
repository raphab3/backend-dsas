import { Injectable } from '@nestjs/common';
import { UpdateProfessionalDto } from '../dto/update-professional.dto';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';

@Injectable()
export class UpdateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalRepository.update(id, updateProfessionalDto);
  }
}
