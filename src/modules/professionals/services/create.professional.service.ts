import PersonSigRepository from '@modules/persosnSig/typeorm/repositories/PersonSigRepository';
import ProfessionalRepository from '../typeorm/repositories/ProfessionalRepository';
import { CreateProfessionalDto } from '../dto/create-professional.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { ICreateProfessional } from '../interfaces/IProfessional';

@Injectable()
export class CreateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
    private readonly personSigRepository: PersonSigRepository,
  ) {}

  async execute(createProfessionalDto: CreateProfessionalDto) {
    const personSig = await this.personSigRepository.findByMatricula(
      createProfessionalDto.matricula,
    );

    if (!personSig) {
      throw new HttpException('Servidor não encontrado', 404);
    }

    const professional: ICreateProfessional = {
      ...createProfessionalDto,
      person_sig: {
        id: personSig.id,
      },
    };

    delete professional?.id;

    return await this.professionalRepository.create(professional);
  }
}
