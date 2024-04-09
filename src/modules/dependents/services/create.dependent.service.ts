import DependentRepository from '../typeorm/repositories/DependentRepository';
import PersonSigRepository from '@modules/persosnSig/typeorm/repositories/PersonSigRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ICreateDependent } from '../interfaces/ICreateDependent';
import { CreateDependentDto } from '../dto/createDependentDto';

@Injectable()
export class CreateDependentService {
  constructor(
    private readonly dependentRepository: DependentRepository,
    private readonly personSigRepository: PersonSigRepository,
  ) {}

  async execute(createDependentDto: CreateDependentDto): Promise<void> {
    const personSig = await this.personSigRepository.findByMatricula(
      createDependentDto.matricula,
    );

    if (!personSig) {
      throw new HttpException(
        `Servidor com matrícula ${createDependentDto.matricula} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newDependent: ICreateDependent = {
      degree_of_kinship: createDependentDto.degree_of_kinship,
      name: createDependentDto.name.toUpperCase(),
      birth_date: createDependentDto.birth_date,
      cpf: createDependentDto.cpf,
      gender: createDependentDto.gender,
      phone: createDependentDto.phone,
      person_sigs: [
        {
          id: personSig.id,
        },
      ],
    };

    await this.dependentRepository.create(newDependent);
  }
}
