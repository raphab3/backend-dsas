import { AuditModule } from '@modules/audits/Audit.module';
import { GeneratePermissionsService } from './services/GeneratePermissionsService';
import { GenerateRolesService } from './services/GenerateRolesService';
import { Module } from '@nestjs/common';
import { PermissionModule } from '@modules/permissions/permission.module';
import { RoleModule } from '@modules/roles/role.module';
import { SeedsController } from './infra/controllers/seeds.controller';

@Module({
  controllers: [SeedsController],
  imports: [AuditModule, PermissionModule, RoleModule],
  providers: [GeneratePermissionsService, GenerateRolesService],
  exports: [],
})
export class SeedsModule {}
