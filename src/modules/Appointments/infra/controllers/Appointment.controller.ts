import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAppointmentDto } from '@modules/Appointments/dto/create-Appointment.dto';
import { CreateAppointmentService } from '@modules/Appointments/services/create.Appointment.service';
import { FindAllAppointmentService } from '@modules/Appointments/services/findAll.Appointment.service';
import { FindOneAppointmentService } from '@modules/Appointments/services/findOne.Appointment.service';
import { RemoveAppointmentService } from '@modules/Appointments/services/remove.Appointment.service';
import { UpdateAppointmentDto } from '@modules/Appointments/dto/update-Appointment.dto';
import { UpdateAppointmentService } from '@modules/Appointments/services/update.Appointment.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@ApiTags('Appointment')
@Controller('Appointment')
export class AppointmentController {
  constructor(
    private readonly createAppointmentService: CreateAppointmentService,
    private readonly findAllAppointmentService: FindAllAppointmentService,
    private readonly findOneAppointmentService: FindOneAppointmentService,
    private readonly updateAppointmentService: UpdateAppointmentService,
    private readonly removeAppointmentService: RemoveAppointmentService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Appointment' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.createAppointmentService.execute(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.findAllAppointmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Appointment' })
  findOne(@Param('id') id: string) {
    return this.findOneAppointmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.updateAppointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeAppointmentService.remove(id);
  }
}
