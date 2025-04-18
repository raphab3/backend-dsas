import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatientHealthInfoService } from '../services/patient-health-info.service';
import { PatientHealthInfoDto } from '../dto/patient-health-info.dto';

@ApiTags('Patient Health Info')
@Controller('patient-health-info')
export class PatientHealthInfoController {
  constructor(private readonly patientHealthInfoService: PatientHealthInfoService) {}

  @Post()
  @ApiOperation({ summary: 'Atualizar informações de saúde do paciente (alergias e doenças crônicas)' })
  updateHealthInfo(@Body() dto: PatientHealthInfoDto) {
    return this.patientHealthInfoService.updatePatientHealthInfo(dto);
  }

  @Get(':patientId')
  @ApiOperation({ summary: 'Obter informações de saúde do paciente' })
  getHealthInfo(@Param('patientId') patientId: string) {
    return this.patientHealthInfoService.getPatientHealthInfo(patientId);
  }
}
