import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAttendanceDto } from '@modules/attendances/dto/create-attendance.dto';
import { CreateAttendanceService } from '@modules/attendances/services/create.attendance.service';
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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';

@ApiTags('attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class AttendanceController {
  constructor(
    private readonly createAttendanceService: CreateAttendanceService,
    private readonly findAllAttendanceService: FindAllAttendanceService,
    private readonly findOneAttendanceService: FindOneAttendanceService,
    private readonly removeAttendanceService: RemoveAttendanceService,
  ) {}

  @Post()
  @AuditLog('CRIAR TEMPLATE')
  @ApiOperation({ summary: 'Create Attendance' })
  @Permission(PermissionsEnum.create_attendance)
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.createAttendanceService.execute(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Attendance' })
  @Permission(PermissionsEnum.find_all_attendances)
  findAll(@Req() req: any) {
    const query = req.query;
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
