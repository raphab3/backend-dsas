import AuditRepository from './typeorm/repositories/AuditRepository';
import { Audit } from './typeorm/entities/Audit.entity';
import { AuditController } from './infra/controllers/Audit.controller';
import { FindAllAuditService } from './services/findAll.Audit.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './services/AuditService';
import { UsersModule } from '@modules/users/users.module';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Audit]);

const ModulesForwardRef = [forwardRef(() => UsersModule)];

@Module({
  controllers: [AuditController],
  providers: [
    AuditRepository,
    AuditService,
    FindAllAuditService,
    AuditInterceptor,
  ],
  imports: [TYPE_ORM_TEMPLATES, ...ModulesForwardRef],
  exports: [AuditService, FindAllAuditService, AuditInterceptor],
})
export default class AuditModule {}
