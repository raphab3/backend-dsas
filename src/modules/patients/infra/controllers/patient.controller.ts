import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { CreatePatientService } from '@modules/patients/services/create.patient.service';
import { FindAllPatientService } from '@modules/patients/services/findAll.patient.service';
import { FindOnePatientService } from '@modules/patients/services/findOne.patient.service';
import { RemovePatientService } from '@modules/patients/services/remove.patient.service';
import { UpdatePatientDto } from '@modules/patients/dto/update-patient.dto';
import { UpdatePatientService } from '@modules/patients/services/update.patient.service';
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
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';

@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class PatientController {
  constructor(
    private readonly createPatientService: CreatePatientService,
    private readonly findAllPatientService: FindAllPatientService,
    private readonly findOnePatientService: FindOnePatientService,
    private readonly updatePatientService: UpdatePatientService,
    private readonly removePatientService: RemovePatientService,
  ) {}

  @AuditLog('CRIAR PACIENTE')
  @Post()
  @ApiOperation({ summary: 'Create Patient' })
  @Permission(PermissionsEnum.create_patient)
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.createPatientService.execute(createPatientDto);
  }

  @Get()
  @Permission(PermissionsEnum.find_all_patients)
  findAll(@Req() req: any) {
    const { query } = req;
    return this.findAllPatientService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Patient' })
  @Permission(PermissionsEnum.find_one_patient)
  findOne(@Param('id') id: string) {
    return this.findOnePatientService.findOne(id);
  }

  @AuditLog('ATUALIZAR PACIENTE')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Patient' })
  @Permission(PermissionsEnum.update_patient)
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.updatePatientService.update(id, updatePatientDto);
  }

  @AuditLog('REMOVER PACIENTE')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Patient' })
  @Permission(PermissionsEnum.remove_patient)
  remove(@Param('id') id: string) {
    return this.removePatientService.remove(id);
  }
}
