import DependentRepository from '../typeorm/repositories/DependentRepository';
import PersonSigRepository from '@modules/persosnSig/typeorm/repositories/PersonSigRepository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ICreateDependent } from '../interfaces/ICreateDependent';

@Injectable()
export class CreateDependentService {
  constructor(
    private readonly dependentRepository: DependentRepository,
    private readonly personSigRepository: PersonSigRepository,
  ) {}

  async execute(createDependentDto: ICreateDependent): Promise<void> {
    const personSig = await this.personSigRepository.findByMatricula(
      createDependentDto.matricula,
    );

    console.log(personSig);

    if (!personSig) {
      throw new HttpException(
        `Servidor com matrícula ${createDependentDto.matricula} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.dependentRepository.create({
      ...createDependentDto,
      person_sigs: [
        {
          id: personSig.id,
        },
      ],
    });
  }
}
