import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from '@modules/roles/dto/create-role.dto';
import { CreateRoleService } from '@modules/roles/services/create.role.service';
import { FindAllRoleService } from '@modules/roles/services/findAll.role.service';
import { FindOneRoleService } from '@modules/roles/services/findOne.role.service';
import { RemoveRoleService } from '@modules/roles/services/remove.role.service';
import { UpdateRoleDto } from '@modules/roles/dto/update-role.dto';
import { UpdateRoleService } from '@modules/roles/services/update.role.service';
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
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('role')
@Controller('role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class RoleController {
  constructor(
    private readonly createRoleService: CreateRoleService,
    private readonly findAllRoleService: FindAllRoleService,
    private readonly findOneRoleService: FindOneRoleService,
    private readonly updateRoleService: UpdateRoleService,
    private readonly removeRoleService: RemoveRoleService,
  ) {}

  @AuditLog('CRIAR ROLE')
  @Post()
  @ApiOperation({ summary: 'Create Role' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.createRoleService.execute(createRoleDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllRoleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Role' })
  findOne(@Param('id') id: string) {
    return this.findOneRoleService.findOne(id);
  }

  @AuditLog('ATUALIZAR ROLE')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.updateRoleService.update(id, updateRoleDto);
  }

  @AuditLog('REMOVER ROLE')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeRoleService.remove(id);
  }
}
