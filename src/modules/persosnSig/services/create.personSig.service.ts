import { Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';

@Injectable()
export class CreatePersonSigService {
  constructor(private readonly personSigRepository: PersonSigRepository) {}

  async execute(createPersonSigDto: any) {
    const saved = await this.personSigRepository.create(createPersonSigDto);

    return saved;
  }
}
