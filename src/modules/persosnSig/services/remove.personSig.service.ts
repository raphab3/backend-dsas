import { Injectable } from '@nestjs/common';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';

@Injectable()
export class RemovePersonSigService {
  constructor(private readonly personSigRepository: PersonSigRepository) {}
  remove(id: string) {
    return this.personSigRepository.delete(id);
  }
}
