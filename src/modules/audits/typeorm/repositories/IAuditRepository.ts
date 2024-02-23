import { Audit } from '../entities/Audit.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { ICreateAudit } from '@modules/audits/dto/ICreateAudit';

export default interface IAuditRepository {
  create(data: ICreateAudit): Promise<Audit>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Audit | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: ICreateAudit): Promise<Audit>;
}
