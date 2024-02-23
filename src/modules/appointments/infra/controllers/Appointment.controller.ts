import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-Appointment.dto';
import { CreateAppointmentService } from '@modules/appointments/services/create.Appointment.service';
import { FindAllAppointmentService } from '@modules/appointments/services/findAll.Appointment.service';
import { FindOneAppointmentService } from '@modules/appointments/services/findOne.Appointment.service';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
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
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.createAppointmentService.execute(createAppointmentDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const { query } = req;
    return this.findAllAppointmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Appointment' })
  findOne(@Param('id') id: string) {
    return this.findOneAppointmentService.findOne(id);
  }

  @AuditLog('ATUALIZAR APPOINTMENT')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.updateAppointmentService.update(id, updateAppointmentDto);
  }

  @AuditLog('REMOVER APPOINTMENT')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeAppointmentService.remove(id);
  }
}
