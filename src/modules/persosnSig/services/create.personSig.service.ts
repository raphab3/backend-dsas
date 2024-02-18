import { HttpException, Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';
import { FindExternalSigpmpbService } from './findExternal.sigpmpb.service';
import { IPersonSig } from '../interfaces/IPersonSig';

@Injectable()
export class CreatePersonSigService {
  constructor(
    private readonly personSigRepository: PersonSigRepository,
    private findExternalSigpmpbService: FindExternalSigpmpbService,
  ) {}

  async execute(matricula: string): Promise<IPersonSig | HttpException> {
    if (!matricula) {
      return new HttpException('Matricula is required', 400);
    }

    const personSigExists =
      await this.personSigRepository.matriculaExists(matricula);

    if (!personSigExists) {
      const personSig =
        await this.findExternalSigpmpbService.execute(matricula);

      if (personSig) {
        return await this.personSigRepository.create(personSig);
      }
    }
  }
}
