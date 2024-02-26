import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from '@modules/permissions/dto/create-permission.dto';
import { CreatePermissionService } from '@modules/permissions/services/create.permission.service';
import { FindAllPermissionService } from '@modules/permissions/services/findAll.permission.service';
import { FindOnePermissionService } from '@modules/permissions/services/findOne.permission.service';
import { RemovePermissionService } from '@modules/permissions/services/remove.permission.service';
import { UpdatePermissionDto } from '@modules/permissions/dto/update-permission.dto';
import { UpdatePermissionService } from '@modules/permissions/services/update.permission.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';

@ApiTags('permission')
@Controller('permission')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class PermissionController {
  constructor(
    private readonly createPermissionService: CreatePermissionService,
    private readonly findAllPermissionService: FindAllPermissionService,
    private readonly findOnePermissionService: FindOnePermissionService,
    private readonly updatePermissionService: UpdatePermissionService,
    private readonly removePermissionService: RemovePermissionService,
  ) {}

  @AuditLog('CRIAR TEMPLATE')
  @Post()
  @ApiOperation({ summary: 'Create Permission' })
  @Permission(ListOfPermissionsEnum.create_permission)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.createPermissionService.execute(createPermissionDto);
  }

  @Get()
  @Permission(ListOfPermissionsEnum.find_all_permissions)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllPermissionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Permission' })
  @Permission(ListOfPermissionsEnum.find_one_permission)
  findOne(@Param('id') id: string) {
    return this.findOnePermissionService.findOne(id);
  }

  @AuditLog('ATUALIZAR TEMPLATE')
  @Patch(':id')
  @Permission(ListOfPermissionsEnum.update_permission)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.updatePermissionService.update(id, updatePermissionDto);
  }

  @AuditLog('REMOVER TEMPLATE')
  @Delete(':id')
  @Permission(ListOfPermissionsEnum.remove_permission)
  remove(@Param('id') id: string) {
    return this.removePermissionService.remove(id);
  }
}
