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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
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

  @AuditLog('CRIAR TEMPLATE')
  @Post()
  @ApiOperation({ summary: 'Create Template' })
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.createTemplateService.execute(createTemplateDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllTemplateService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Template' })
  findOne(@Param('id') id: string) {
    return this.findOneTemplateService.findOne(id);
  }

  @AuditLog('ATUALIZAR TEMPLATE')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.updateTemplateService.update(id, updateTemplateDto);
  }

  @AuditLog('REMOVER TEMPLATE')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeTemplateService.remove(id);
  }
}
