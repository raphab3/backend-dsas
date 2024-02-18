import { CreatePersonSigDto } from '@modules/persosnSig/dto/create-personSig.dto';
import { PersonSig } from '../entities/personSig.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import { IQueryPersonSig } from '@modules/persosnSig/interfaces/IQueryPersonSig';

export default interface IPersonSigRepository {
  create(data: CreatePersonSigDto): Promise<IPersonSig>;
  list(query: IQueryPersonSig): Promise<IPaginatedResult<IPersonSig>>;
  findOne(id: string): Promise<PersonSig | undefined>;
  findByMatricula(matricula: string): Promise<PersonSig | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreatePersonSigDto): Promise<PersonSig>;
  matriculaExists(matricula: string): Promise<boolean>;
}
