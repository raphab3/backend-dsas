import { Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';
import { IPersonSig } from '../interfaces/IPersonSig';

@Injectable()
export class FindByMatriculaPersonSigService {
  constructor(private readonly personSigRepository: PersonSigRepository) {}
  async execute(matricula: string): Promise<IPersonSig> {
    return await this.personSigRepository.findByMatricula(matricula);
  }
}
