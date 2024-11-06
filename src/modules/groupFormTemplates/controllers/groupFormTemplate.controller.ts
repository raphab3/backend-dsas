import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGroupFormTemplateDto } from '@modules/groupFormTemplates/dto/create-groupFormTemplate.dto';
import { CreateGroupFormTemplateService } from '@modules/groupFormTemplates/services/create.groupFormTemplate.service';
import { FindAllGroupFormTemplateService } from '@modules/groupFormTemplates/services/findAll.groupFormTemplate.service';
import { FindOneGroupFormTemplateService } from '@modules/groupFormTemplates/services/findOne.groupFormTemplate.service';
import { RemoveGroupFormTemplateService } from '@modules/groupFormTemplates/services/remove.groupFormTemplate.service';
import { UpdateGroupFormTemplateDto } from '@modules/groupFormTemplates/dto/update-groupFormTemplate.dto';
import { UpdateGroupFormTemplateService } from '@modules/groupFormTemplates/services/update.groupFormTemplate.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { QueryGroupFormTemplateDto } from '../dto/query-groupFormTemplate.dto';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('group-form-templates')
@Controller('group-form-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class GroupFormTemplateController {
  constructor(
    private readonly createGroupFormTemplateService: CreateGroupFormTemplateService,
    private readonly findAllGroupFormTemplateService: FindAllGroupFormTemplateService,
    private readonly findOneGroupFormTemplateService: FindOneGroupFormTemplateService,
    private readonly updateGroupFormTemplateService: UpdateGroupFormTemplateService,
    private readonly removeGroupFormTemplateService: RemoveGroupFormTemplateService,
  ) {}

  @Post()
  @AuditLog('CRIAR TEMPLATE')
  @ApiOperation({ summary: 'Create GroupFormTemplate' })
  @Permission(PermissionsEnum.create_groupFormTemplate)
  create(@Body() createGroupFormTemplateDto: CreateGroupFormTemplateDto) {
    return this.createGroupFormTemplateService.execute(
      createGroupFormTemplateDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Find all GroupFormTemplate' })
  @Permission(PermissionsEnum.find_all_groupFormTemplates)
  findAll(@Query() query: QueryGroupFormTemplateDto) {
    return this.findAllGroupFormTemplateService.execute(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Find one GroupFormTemplate' })
  @Permission(PermissionsEnum.find_one_groupFormTemplate)
  findOne(@Param('uuid') uuid: string) {
    return this.findOneGroupFormTemplateService.execute(uuid);
  }

  @Patch(':uuid')
  @AuditLog('ATUALIZAR TEMPLATE')
  @ApiOperation({ summary: 'Update GroupFormTemplate' })
  @Permission(PermissionsEnum.update_groupFormTemplate)
  update(
    @Param('uuid') uuid: string,
    @Body() updateGroupFormTemplateDto: UpdateGroupFormTemplateDto,
  ) {
    return this.updateGroupFormTemplateService.update(
      uuid,
      updateGroupFormTemplateDto,
    );
  }

  @Delete(':uuid')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove GroupFormTemplate' })
  @Permission(PermissionsEnum.remove_groupFormTemplate)
  remove(@Param('uuid') uuid: string) {
    return this.removeGroupFormTemplateService.remove(uuid);
  }
}
