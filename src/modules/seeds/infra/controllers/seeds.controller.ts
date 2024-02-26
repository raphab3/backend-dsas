import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditLog } from '@modules/audits/decorators';
import { GeneratePermissionsService } from '@modules/seeds/services/GeneratePermissionsService';
import {
  Controller,
  Post,
  Catch,
  HttpException,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';
import { Permission } from '@shared/decorators/Permission';
import { GenerateRolesService } from '@modules/seeds/services/GenerateRolesService';

@Catch(HttpException)
@ApiTags('seeds')
@Controller('seeds')
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class SeedsController {
  constructor(
    private readonly generatePermissions: GeneratePermissionsService,
    private readonly generateRoles: GenerateRolesService,
  ) {}

  @Get('/permissions')
  @AuditLog('SEED - generate permissions')
  @Post()
  @ApiOperation({ summary: 'Generate all permissions' })
  @Permission(ListOfPermissionsEnum.seed_generate_permissions)
  async addPermission() {
    await this.generatePermissions.execute();
  }

  @Get('/roles')
  @AuditLog('SEED - generate roles')
  @Post()
  @ApiOperation({ summary: 'Generate all roles' })
  @Permission(ListOfPermissionsEnum.seed_generate_roles)
  async addRoles() {
    await this.generateRoles.execute();
  }
}
