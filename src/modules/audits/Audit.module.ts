import AuditRepository from './typeorm/repositories/AuditRepository';
import { Audit } from './typeorm/entities/Audit.entity';
import { AuditController } from './infra/controllers/Audit.controller';
import { FindAllAuditService } from './services/findAll.Audit.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './services/AuditService';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Audit]);

@Module({
  controllers: [AuditController],
  providers: [AuditRepository, AuditService, FindAllAuditService],
  imports: [TYPE_ORM_TEMPLATES],
  exports: [AuditService],
})
export class AuditModule {}
