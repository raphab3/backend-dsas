import { Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';

@Injectable()
export class FindAllPersonSigService {
  constructor(private readonly personSigRepository: PersonSigRepository) {}

  async findAll(query: any): Promise<any> {
    return this.personSigRepository.list(query);
  }
}
