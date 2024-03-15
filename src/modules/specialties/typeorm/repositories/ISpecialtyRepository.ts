import { CreateSpecialtyDto } from '@modules/specialties/dto/create-Specialty.dto';
import { Specialty } from '../entities/Specialty.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { IQuerySpecialty } from '@modules/specialties/interfaces/IQuerySpecialty';

export default interface ISpecialtyRepository {
  create(data: CreateSpecialtyDto): Promise<Specialty>;
  list(query: IQuerySpecialty): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Specialty | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateSpecialtyDto): Promise<Specialty>;
}
