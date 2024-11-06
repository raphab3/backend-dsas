import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTemplateDto } from '@modules/templates/dto/create-template.dto';
import { CreateTemplateService } from '@modules/templates/services/create.template.service';
import { FindAllTemplateService } from '@modules/templates/services/findAll.template.service';
import { FindOneTemplateService } from '@modules/templates/services/findOne.template.service';
import { RemoveTemplateService } from '@modules/templates/services/remove.template.service';
import { UpdateTemplateDto } from '@modules/templates/dto/update-template.dto';
import { UpdateTemplateService } from '@modules/templates/services/update.template.service';
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
import { QueryTemplateDto } from '../dto/query-template.dto';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('template')
@Controller('template')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class TemplateController {
  constructor(
    private readonly createTemplateService: CreateTemplateService,
    private readonly findAllTemplateService: FindAllTemplateService,
    private readonly findOneTemplateService: FindOneTemplateService,
    private readonly updateTemplateService: UpdateTemplateService,
    private readonly removeTemplateService: RemoveTemplateService,
  ) {}

  @Post()
  @AuditLog('CRIAR TEMPLATE')
  @ApiOperation({ summary: 'Create Template' })
  @Permission(PermissionsEnum.create_template)
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.createTemplateService.execute(createTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Template' })
  @Permission(PermissionsEnum.find_all_templates)
  findAll(@Query() query: QueryTemplateDto) {
    return this.findAllTemplateService.execute(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Find one Template' })
  @Permission(PermissionsEnum.find_one_template)
  findOne(@Param('uuid') uuid: string) {
    return this.findOneTemplateService.execute(uuid);
  }

  @Patch(':uuid')
  @AuditLog('ATUALIZAR TEMPLATE')
  @ApiOperation({ summary: 'Update Template' })
  @Permission(PermissionsEnum.update_template)
  update(
    @Param('uuid') uuid: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.updateTemplateService.update(uuid, updateTemplateDto);
  }

  @Delete(':uuid')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove Template' })
  @Permission(PermissionsEnum.remove_template)
  remove(@Param('uuid') uuid: string) {
    return this.removeTemplateService.remove(uuid);
  }
}
