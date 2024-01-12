import { Injectable } from '@nestjs/common';
import { UpdatePersonSigDto } from '../dto/update-personSig.dto';
import PersonSigRepository from '../typeorm/repositories/PersonSigRepository';

@Injectable()
export class UpdatePersonSigService {
  constructor(private readonly personSigRepository: PersonSigRepository) {}
  update(id: string, updatePersonSigDto: UpdatePersonSigDto) {
    return this.personSigRepository.update(id, updatePersonSigDto);
  }
}
