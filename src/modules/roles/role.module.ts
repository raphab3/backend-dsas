import RoleRepository from './typeorm/repositories/RoleRepository';
import { CreateRoleService } from './services/create.role.service';
import { FindAllRoleService } from './services/findAll.role.service';
import { FindOneRoleService } from './services/findOne.role.service';
import { Module, forwardRef } from '@nestjs/common';
import { RemoveRoleService } from './services/remove.role.service';
import { Role } from './typeorm/entities/role.entity';
import { RoleController } from './infra/controllers/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateRoleService } from './services/update.role.service';
import { PermissionModule } from '@modules/permissions/permission.module';
import AuditModule from '@modules/audits/Audit.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Role]);

const ModulesForwardRef = [
  forwardRef(() => PermissionModule),
  forwardRef(() => AuditModule),
];

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
  imports: [TYPE_ORM_TEMPLATES, ...ModulesForwardRef],
  exports: [RoleRepository],
})
export class RoleModule {}
