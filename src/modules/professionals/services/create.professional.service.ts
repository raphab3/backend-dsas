import { Injectable } from '@nestjs/common';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';
import { CreateProfessionalDto } from '../dto/create-professional.dto';

interface IRequest extends CreateProfessionalDto {
  person_sig: {
    id: string;
  };
  user: {
    id: string;
  };
}
@Injectable()
export class CreateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
  ) {}

  async execute(createProfessionalDto: CreateProfessionalDto) {
    const professional: IRequest = {
      ...createProfessionalDto,
      person_sig: {
        id: createProfessionalDto.person_sig_id,
      },
      user: {
        id: createProfessionalDto.user_id,
      },
    };

    const saved = await this.professionalRepository.create(professional);

    return saved;
  }
}
