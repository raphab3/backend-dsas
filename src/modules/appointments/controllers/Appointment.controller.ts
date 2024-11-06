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
  UseInterceptors,
  Query,
  Req,
  NotFoundException,
  Version,
} from '@nestjs/common';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { QueryAppointmentDto } from '@modules/appointments/dto/query-Appointment.dto';
import { Locations } from '@shared/decorators/Location';
import { FindAllByEnduserAppointmentService } from '@modules/appointments/services/findAllByEndUserAppointment.service';
import { CreateEndUserAppointmentService } from '@modules/appointments/services/createEnduser.Appointment.service';
import { CreateEndUserAppointmentDto } from '@modules/appointments/dto/create-enduser-Appointment.dto';
import { FindAlAppointmentsV2Service } from '../services/findAllAppointmentsV2.service';

@ApiTags('appointments')
@Controller('appointments')
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class AppointmentController {
  constructor(
    private readonly createAppointmentService: CreateAppointmentService,
    private readonly createEndUserAppointmentService: CreateEndUserAppointmentService,
    private readonly findAllAppointmentService: FindAllAppointmentService,
    private readonly findAllByEnduserAppointmentService: FindAllByEnduserAppointmentService,
    private readonly findOneAppointmentService: FindOneAppointmentService,
    private readonly updateAppointmentService: UpdateAppointmentService,
    private readonly removeAppointmentService: RemoveAppointmentService,
    private readonly findAllAlAppointmentsV2Service: FindAlAppointmentsV2Service,
  ) {}

  @AuditLog('CRIAR APPOINTMENT')
  @Post()
  @ApiOperation({ summary: 'Create Appointment' })
  @Permission(PermissionsEnum.create_appointment)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.createAppointmentService.execute(createAppointmentDto);
  }

  @AuditLog('CRIAR APPOINTMENT ENDUSER')
  @Post('enduser')
  @ApiOperation({ summary: 'Create EndUser Appointment' })
  // @Permission(PermissionsEnum.create_enduser_appointment)
  createEndUserAppointment(
    @Body() createAppointmentDto: CreateEndUserAppointmentDto,
  ) {
    return this.createEndUserAppointmentService.execute(createAppointmentDto);
  }

  @Get()
  @Permission(PermissionsEnum.find_all_appointments)
  @Locations()
  findAll(@Req() req: any, @Query() dto: QueryAppointmentDto) {
    const userLocations = req.userLocations;

    if (userLocations) {
      dto.locations = userLocations;
    }

    return this.findAllAppointmentService.findAll(dto);
  }

  @Get()
  @Version('2')
  @Permission(PermissionsEnum.find_all_appointments)
  @Locations()
  findAllV2(@Query() dto: QueryAppointmentDto) {
    return this.findAllAlAppointmentsV2Service.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Appointment' })
  @Permission(PermissionsEnum.find_one_appointment)
  async findOne(@Param('id') id: string, @Query() query: QueryAppointmentDto) {
    if (this.isValidUUID(id)) {
      return this.findOneAppointmentService.findOne(id);
    } else if (id === 'enduser') {
      return this.findAllByEnduserAppointmentService.findAll(query);
    } else {
      throw new NotFoundException('Invalid identifier');
    }
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
  async remove(@Param('id') id: string) {
    return await this.removeAppointmentService.remove(id);
  }

  isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
