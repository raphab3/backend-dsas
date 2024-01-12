import { Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';

@Injectable()
export class FindOnePersonSigService {
  constructor(private readonly personSigRepository: PersonSigRepository) {}
  async findOne(id: string): Promise<any> {
    return this.personSigRepository.findOne(id);
  }
}
