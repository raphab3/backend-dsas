import { CreateProfessionalDto } from '@modules/professionals/dto/create-professional.dto';
import { Professional } from '../entities/professional.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface IProfessionalRepository {
  create(data: CreateProfessionalDto): Promise<Professional>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Professional | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateProfessionalDto): Promise<Professional>;
}
