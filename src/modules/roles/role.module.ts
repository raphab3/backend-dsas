import RoleRepository from './typeorm/repositories/RoleRepository';
import { AuditModule } from '@modules/audits/Audit.module';
import { CreateRoleService } from './services/create.role.service';
import { FindAllRoleService } from './services/findAll.role.service';
import { FindOneRoleService } from './services/findOne.role.service';
import { Module } from '@nestjs/common';
import { RemoveRoleService } from './services/remove.role.service';
import { Role } from './typeorm/entities/role.entity';
import { RoleController } from './infra/controllers/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateRoleService } from './services/update.role.service';
import { PermissionModule } from '@modules/permissions/permission.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Role]);

@Module({
  controllers: [RoleController],
  providers: [
    RoleRepository,
    FindOneRoleService,
    CreateRoleService,
    FindAllRoleService,
    UpdateRoleService,
    RemoveRoleService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule, PermissionModule],
  exports: [RoleRepository],
})
export class RoleModule {}
