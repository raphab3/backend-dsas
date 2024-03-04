import { Injectable } from '@nestjs/common';
import { UpdateProfessionalDto } from '../dto/update-professional.dto';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';
import { IUpdateProfessional } from '../interfaces/IProfessional';

@Injectable()
export class UpdateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}
  update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    const professionalExists = this.professionalRepository.findOne(id);

    if (!professionalExists) {
      throw new Error('Professional not found');
    }

    const professional: IUpdateProfessional = {
      id: id,
      council: updateProfessionalDto.council,
      specialties: updateProfessionalDto.specialties,
      locations: updateProfessionalDto.locations,
    };

    return this.professionalRepository.update(id, professional);
  }
}
