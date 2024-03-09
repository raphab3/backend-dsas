import { Injectable } from '@nestjs/common';
import DependentRepository from '../typeorm/repositories/DependentRepository';
import PersonSigRepository from '@modules/persosnSig/typeorm/repositories/PersonSigRepository';
import { CreateDependentDto } from '../dto/createDependentDto';

@Injectable()
export class UpdateDependentService {
  constructor(
    private readonly dependentRepository: DependentRepository,
    private readonly personSigRepository: PersonSigRepository,
  ) {}
  async update(
    id: string,
    updateDependentDto: CreateDependentDto,
  ): Promise<void> {
    const personSig = await this.personSigRepository.findByMatricula(
      updateDependentDto.matricula,
    );

    if (!personSig) {
      throw new Error('PersonSig not found');
    }

    const dependent = await this.dependentRepository.findOne(id);

    if (!dependent) {
      throw new Error('Dependent not found');
    }

    if (dependent?.person_sigs?.length > 0) {
      dependent.person_sigs.find((personSig) => {
        if (personSig.id !== personSig.id) {
          throw new Error('Servidor já está vinculado a esse dependente');
        }
      });
    }

    const { name, degree_of_kinship, birth_date, cpf, gender, phone } =
      updateDependentDto;

    await this.dependentRepository.update(id, {
      name,
      degree_of_kinship,
      birth_date,
      cpf,
      gender,
      phone,
    });
  }
}
