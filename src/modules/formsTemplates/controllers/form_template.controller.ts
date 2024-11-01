import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Query,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateFormTemplateService } from '../services/create.form_template.service';
import { FindAllFormTemplateService } from '../services/findAll.form_template.service';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { QueryFormTemplateDto } from '../dto/query-form_template.dto';
import { CreateFormTemplateDto } from '../dto/form-template.dto';
import { UpdateFormTemplateService } from '../services/UpdateFormTemplate.service';
import { GetFormTemplateByIdService } from '../services/GetFormTemplateById.service';

@ApiTags('form-templates')
@Controller('form-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class FormTemplateController {
  constructor(
    private readonly createFormTemplateService: CreateFormTemplateService,
    private readonly findAllFormTemplateService: FindAllFormTemplateService,
    private readonly updateFormTemplateService: UpdateFormTemplateService,
    private readonly getFormTemplateByIdService: GetFormTemplateByIdService,
  ) {}

  @Post()
  @AuditLog('CRIAR form template')
  @ApiOperation({ summary: 'Create FormTemplate' })
  create(
    @Req() req: any,
    @Body()
    createFormTemplateDto: CreateFormTemplateDto,
  ) {
    return this.createFormTemplateService.execute({
      ...createFormTemplateDto,
      createdBy: req.user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Find all FormTemplate' })
  findAll(@Query() query: QueryFormTemplateDto) {
    return this.findAllFormTemplateService.execute(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Find FormTemplate by id' })
  findById(@Param('id') id: string) {
    return this.getFormTemplateByIdService.execute(id);
  }

  @Patch('/:id')
  @AuditLog('UPDATE form template')
  @ApiOperation({ summary: 'Update FormTemplate' })
  update(@Req() req: any, @Body() updateFormTemplateDto: any) {
    return this.updateFormTemplateService.execute(
      req.params.id,
      updateFormTemplateDto,
    );
  }
}
