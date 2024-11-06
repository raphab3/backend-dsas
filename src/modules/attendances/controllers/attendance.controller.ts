import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StartAttendanceService } from '@modules/attendances/services/start.attendance.service';
import { FindAllAttendanceService } from '@modules/attendances/services/findAll.attendance.service';
import { FindOneAttendanceService } from '@modules/attendances/services/findOne.attendance.service';
import { RemoveAttendanceService } from '@modules/attendances/services/remove.attendance.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Patch,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { StartAttendanceDto } from '../dto/start-attendance.dto';
import { UpdateStatusAttendanceDto } from '../dto/updateStatus-attendance.dto';
import { UpdateStatusAttendanceService } from '../services/updateStatus.attendance.service';
import { QueryAttendanceDto } from '../dto/query-attendance.dto';

@ApiTags('attendances')
@Controller('attendances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class AttendanceController {
  constructor(
    private readonly startAttendanceService: StartAttendanceService,
    private readonly findAllAttendanceService: FindAllAttendanceService,
    private readonly findOneAttendanceService: FindOneAttendanceService,
    private readonly removeAttendanceService: RemoveAttendanceService,
    private readonly updateStatusAttendanceService: UpdateStatusAttendanceService,
  ) {}

  @Post('start')
  @AuditLog('INICIAR ATENDIMENTO')
  @ApiOperation({ summary: 'Start Attendance' })
  @Permission(PermissionsEnum.create_attendance)
  create(@Body() startAttendanceDto: StartAttendanceDto) {
    return this.startAttendanceService.execute(startAttendanceDto);
  }

  @Patch(':id/status')
  @AuditLog('ATUALIZAR STATUS')
  @ApiOperation({ summary: 'Update Attendance Status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusAttendanceDto: UpdateStatusAttendanceDto,
  ) {
    return this.updateStatusAttendanceService.execute(
      id,
      updateStatusAttendanceDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Find all Attendance' })
  @Permission(PermissionsEnum.find_all_attendances)
  findAll(@Query() query: QueryAttendanceDto): Promise<any> {
    return this.findAllAttendanceService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Attendance' })
  @Permission(PermissionsEnum.find_one_attendance)
  findOne(@Param('id') id: string) {
    return this.findOneAttendanceService.findOne(id);
  }

  @Delete(':id')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove Attendance' })
  @Permission(PermissionsEnum.remove_attendance)
  remove(@Param('id') id: string) {
    return this.removeAttendanceService.remove(id);
  }
}
