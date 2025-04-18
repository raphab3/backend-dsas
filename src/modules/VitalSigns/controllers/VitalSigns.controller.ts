import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FindAllVitalSignsService } from '@modules/VitalSigns/services/findAll.VitalSigns.service';
import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { QueryVitalSignsDto } from '../dto/query-VitalSign.dto';
import { RemoveVitalSignsService } from '../services/remove.VitalSign.service';
import { UpsertVitalSignsDto } from '../dto/upsert-VitalSign.dto';
import { UpsertVitalSignsService } from '../services/upsert.VitalSign.service';
import { GetVitalSignsHistoryService } from '../services/getHistory.VitalSigns.service';
import { GetLatestVitalSignsService } from '../services/getLatest.VitalSigns.service';
import { QueryVitalSignsHistoryDto } from '../dto/query-VitalSignsHistory.dto';

@ApiTags('vital-signs')
@Controller('vital-signs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class VitalSignsController {
  constructor(
    private readonly findAllVitalSignsService: FindAllVitalSignsService,
    private readonly upsertVitalSignsService: UpsertVitalSignsService,
    private readonly removeVitalSignsService: RemoveVitalSignsService,
    private readonly getVitalSignsHistoryService: GetVitalSignsHistoryService,
    private readonly getLatestVitalSignsService: GetLatestVitalSignsService,
  ) {}

  @Post()
  @AuditLog('Atualizar/Criar VitalSigns')
  @ApiOperation({ summary: 'Update VitalSigns' })
  // @Permission(PermissionsEnum.update_VitalSigns)
  update(@Body() upsertVitalSignsDto: UpsertVitalSignsDto) {
    console.log('upsertVitalSignsDto', upsertVitalSignsDto);
    return this.upsertVitalSignsService.execute(upsertVitalSignsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all VitalSigns',
    description:
      'Get vital signs with optional filtering. Use attendanceId to get vital signs for a specific attendance. Use latest=true with patientId to get the most recent vital signs for a patient. When both patientId and attendanceId are provided, attendanceId takes precedence.',
  })
  // @Permission(PermissionsEnum.find_all_VitalSigns)
  findAll(@Query() query: QueryVitalSignsDto) {
    return this.findAllVitalSignsService.execute(query);
  }

  @Delete(':uuid')
  @AuditLog('REMOVER VitalSigns')
  @ApiOperation({ summary: 'Remove VitalSigns' })
  @Permission(PermissionsEnum.remove_VitalSigns)
  remove(@Param('uuid') uuid: string) {
    return this.removeVitalSignsService.remove(uuid);
  }

  @Get('history/patient/:patientId')
  @ApiOperation({ summary: 'Get patient vital signs history' })
  @Permission(PermissionsEnum.find_all_VitalSigns)
  async getPatientHistory(
    @Param('patientId') patientId: string,
    @Query() query: QueryVitalSignsHistoryDto,
  ) {
    return this.getVitalSignsHistoryService.execute(patientId, {
      startDate: query.startDate,
      endDate: query.endDate,
      metric: query.metric,
    });
  }

  @Get('history/attendance/:attendanceId')
  @ApiOperation({ summary: 'Get attendance vital signs history' })
  @Permission(PermissionsEnum.find_all_VitalSigns)
  async getAttendanceHistory(@Param('attendanceId') attendanceId: string) {
    return this.getVitalSignsHistoryService.executeByAttendance(attendanceId);
  }

  @Get('latest/patient/:patientId')
  @ApiOperation({
    summary: 'Get latest vital signs for a patient',
    description:
      'Returns the most recent vital signs for a patient. Optionally, can specify an attendance ID to get vital signs for that specific attendance.',
  })
  @ApiParam({ name: 'patientId', description: 'Patient ID', required: true })
  @ApiQuery({
    name: 'attendanceId',
    description: 'Optional attendance ID',
    required: false,
  })
  // @Permission(PermissionsEnum.find_all_VitalSigns)
  async getLatestVitalSigns(
    @Param('patientId') patientId: string,
    @Query('attendanceId') attendanceId?: string,
  ) {
    return this.getLatestVitalSignsService.execute(patientId, attendanceId);
  }
}
