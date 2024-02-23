import { Injectable } from '@nestjs/common';
import AuditRepository from '../typeorm/repositories/AuditRepository';
import { ICreateAudit } from '../dto/ICreateAudit';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async execute(data: ICreateAudit): Promise<void> {
    const saved = await this.auditRepository.create({
      ...data,
    });
    console.log('CreateAuditService -> saved', saved);
  }
}
