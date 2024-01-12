import { CreatePersonSigDto } from '@modules/persosnSig/dto/create-personSig.dto';
import { PersonSig } from '../entities/personSig.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface IPersonSigRepository {
  create(data: CreatePersonSigDto): Promise<PersonSig>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<PersonSig | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreatePersonSigDto): Promise<PersonSig>;
}
