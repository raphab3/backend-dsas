import { Injectable } from '@nestjs/common';
import AuditRepository from '../typeorm/repositories/AuditRepository';

@Injectable()
export class FindAllAuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async findAll(query: any): Promise<any> {
    return this.auditRepository.list(query);
  }
}
