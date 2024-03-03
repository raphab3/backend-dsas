import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditLog } from '@modules/audits/decorators';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-Appointment.dto';
import { CreateAppointmentService } from '@modules/appointments/services/create.Appointment.service';
import { FindAllAppointmentService } from '@modules/appointments/services/findAll.Appointment.service';
import { FindOneAppointmentService } from '@modules/appointments/services/findOne.Appointment.service';
import { Permission } from '@shared/decorators/Permission';
import { RemoveAppointmentService } from '@modules/appointments/services/remove.Appointment.service';
import { UpdateAppointmentDto } from '@modules/appointments/dto/update-Appointment.dto';
import { UpdateAppointmentService } from '@modules/appointments/services/update.Appointment.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';

@ApiTags('appointments')
@Controller('appointments')
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class AppointmentController {
  constructor(
    private readonly createAppointmentService: CreateAppointmentService,
    private readonly findAllAppointmentService: FindAllAppointmentService,
    private readonly findOneAppointmentService: FindOneAppointmentService,
    private readonly updateAppointmentService: UpdateAppointmentService,
    private readonly removeAppointmentService: RemoveAppointmentService,
  ) {}

  @AuditLog('CRIAR APPOINTMENT')
  @Post()
  @ApiOperation({ summary: 'Create Appointment' })
  @Permission(PermissionsEnum.create_appointment)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.createAppointmentService.execute(createAppointmentDto);
  }

  @Get()
  @Permission(PermissionsEnum.find_all_appointments)
  findAll(@Req() req: any) {
    const { query } = req;

    return this.findAllAppointmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Appointment' })
  @Permission(PermissionsEnum.find_one_appointment)
  findOne(@Param('id') id: string) {
    return this.findOneAppointmentService.findOne(id);
  }

  @AuditLog('ATUALIZAR APPOINTMENT')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Appointment' })
  @Permission(PermissionsEnum.update_appointment)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.updateAppointmentService.update(id, updateAppointmentDto);
  }

  @AuditLog('REMOVER APPOINTMENT')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Appointment' })
  @Permission(PermissionsEnum.remove_appointment)
  remove(@Param('id') id: string) {
    return this.removeAppointmentService.remove(id);
  }
}
