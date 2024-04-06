import PermissionRepository from './typeorm/repositories/PermissionRepository';
import { CreatePermissionService } from './services/create.permission.service';
import { FindAllPermissionService } from './services/findAll.permission.service';
import { FindOnePermissionService } from './services/findOne.permission.service';
import { Module, forwardRef } from '@nestjs/common';
import { RemovePermissionService } from './services/remove.permission.service';
import { Permission } from './typeorm/entities/permission.entity';
import { PermissionController } from './infra/controllers/permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatePermissionService } from './services/update.permission.service';
import AuditModule from '@modules/audits/Audit.module';
const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Permission]);

const ModulesForwardRef = [forwardRef(() => AuditModule)];

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionRepository,
    FindOnePermissionService,
    CreatePermissionService,
    FindAllPermissionService,
    UpdatePermissionService,
    RemovePermissionService,
  ],
  imports: [TYPE_ORM_TEMPLATES, ...ModulesForwardRef],
  exports: [PermissionRepository],
})
export class PermissionModule {}
