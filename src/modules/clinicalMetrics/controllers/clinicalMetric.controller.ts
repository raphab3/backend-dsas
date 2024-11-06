import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateClinicalMetricDto } from '@modules/clinicalMetrics/dto/create-clinicalMetric.dto';
import { CreateClinicalMetricService } from '@modules/clinicalMetrics/services/create.clinicalMetric.service';
import { FindAllClinicalMetricService } from '@modules/clinicalMetrics/services/findAll.clinicalMetric.service';
import { FindOneClinicalMetricService } from '@modules/clinicalMetrics/services/findOne.clinicalMetric.service';
import { RemoveClinicalMetricService } from '@modules/clinicalMetrics/services/remove.clinicalMetric.service';
import { UpdateClinicalMetricDto } from '@modules/clinicalMetrics/dto/update-clinicalMetric.dto';
import { UpdateClinicalMetricService } from '@modules/clinicalMetrics/services/update.clinicalMetric.service';
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
import { QueryClinicalMetricDto } from '../dto/query-clinicalMetric.dto';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('clinicalMetric')
@Controller('clinicalMetric')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class ClinicalMetricController {
  constructor(
    private readonly createClinicalMetricService: CreateClinicalMetricService,
    private readonly findAllClinicalMetricService: FindAllClinicalMetricService,
    private readonly findOneClinicalMetricService: FindOneClinicalMetricService,
    private readonly updateClinicalMetricService: UpdateClinicalMetricService,
    private readonly removeClinicalMetricService: RemoveClinicalMetricService,
  ) {}

  @Post()
  @AuditLog('CRIAR TEMPLATE')
  @ApiOperation({ summary: 'Create ClinicalMetric' })
  @Permission(PermissionsEnum.create_clinicalMetric)
  create(@Body() createClinicalMetricDto: CreateClinicalMetricDto) {
    return this.createClinicalMetricService.execute(createClinicalMetricDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all ClinicalMetric' })
  @Permission(PermissionsEnum.find_all_clinicalMetrics)
  findAll(@Query() query: QueryClinicalMetricDto) {
    return this.findAllClinicalMetricService.execute(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Find one ClinicalMetric' })
  @Permission(PermissionsEnum.find_one_clinicalMetric)
  findOne(@Param('uuid') uuid: string) {
    return this.findOneClinicalMetricService.execute(uuid);
  }

  @Patch(':uuid')
  @AuditLog('ATUALIZAR TEMPLATE')
  @ApiOperation({ summary: 'Update ClinicalMetric' })
  @Permission(PermissionsEnum.update_clinicalMetric)
  update(
    @Param('uuid') uuid: string,
    @Body() updateClinicalMetricDto: UpdateClinicalMetricDto,
  ) {
    return this.updateClinicalMetricService.update(
      uuid,
      updateClinicalMetricDto,
    );
  }

  @Delete(':uuid')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove ClinicalMetric' })
  @Permission(PermissionsEnum.remove_clinicalMetric)
  remove(@Param('uuid') uuid: string) {
    return this.removeClinicalMetricService.remove(uuid);
  }
}
