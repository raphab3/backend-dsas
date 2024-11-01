import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePatientRecordDto } from '@modules/patientRecords/dto/create-patientRecord.dto';
import { CreatePatientRecordService } from '@modules/patientRecords/services/create.patientRecord.service';
import { FindAllPatientRecordService } from '@modules/patientRecords/services/findAll.patientRecord.service';
import { FindOnePatientRecordService } from '@modules/patientRecords/services/findOne.patientRecord.service';
import { RemovePatientRecordService } from '@modules/patientRecords/services/remove.patientRecord.service';
import { UpdatePatientRecordDto } from '@modules/patientRecords/dto/update-patientRecord.dto';
import { UpdatePatientRecordService } from '@modules/patientRecords/services/update.patientRecord.service';
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
import { QueryPatientRecordDto } from '../dto/query-patientRecord.dto';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('patientRecord')
@Controller('patientRecord')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class PatientRecordController {
  constructor(
    private readonly createPatientRecordService: CreatePatientRecordService,
    private readonly findAllPatientRecordService: FindAllPatientRecordService,
    private readonly findOnePatientRecordService: FindOnePatientRecordService,
    private readonly updatePatientRecordService: UpdatePatientRecordService,
    private readonly removePatientRecordService: RemovePatientRecordService,
  ) {}

  @Post()
  @AuditLog('CRIAR TEMPLATE')
  @ApiOperation({ summary: 'Create PatientRecord' })
  @Permission(PermissionsEnum.create_patientRecord)
  create(@Body() createPatientRecordDto: CreatePatientRecordDto) {
    return this.createPatientRecordService.execute(createPatientRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all PatientRecord' })
  @Permission(PermissionsEnum.find_all_patientRecords)
  findAll(@Query() query: QueryPatientRecordDto) {
    return this.findAllPatientRecordService.execute(query);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Find one PatientRecord' })
  @Permission(PermissionsEnum.find_one_patientRecord)
  findOne(@Param('uuid') uuid: string) {
    return this.findOnePatientRecordService.execute(uuid);
  }

  @Patch(':uuid')
  @AuditLog('ATUALIZAR TEMPLATE')
  @ApiOperation({ summary: 'Update PatientRecord' })
  @Permission(PermissionsEnum.update_patientRecord)
  update(
    @Param('uuid') uuid: string,
    @Body() updatePatientRecordDto: UpdatePatientRecordDto,
  ) {
    return this.updatePatientRecordService.update(uuid, updatePatientRecordDto);
  }

  @Delete(':uuid')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove PatientRecord' })
  @Permission(PermissionsEnum.remove_patientRecord)
  remove(@Param('uuid') uuid: string) {
    return this.removePatientRecordService.remove(uuid);
  }
}
