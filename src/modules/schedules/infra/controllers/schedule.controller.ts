import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateScheduleDto } from '@modules/schedules/dto/create-schedule.dto';
import { CreateScheduleService } from '@modules/schedules/services/create.schedule.service';
import { FindAllScheduleService } from '@modules/schedules/services/findAll.schedule.service';
import { FindOneScheduleService } from '@modules/schedules/services/findOne.schedule.service';
import { RemoveScheduleService } from '@modules/schedules/services/remove.schedule.service';
import { UpdateScheduleDto } from '@modules/schedules/dto/update-schedule.dto';
import { UpdateScheduleService } from '@modules/schedules/services/update.schedule.service';
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
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { IQuerySchedule } from '@modules/schedules/interfaces/IQuerySchedule';
import { Locations } from '@shared/decorators/Location';
import { FindAllScheduleEndUserService } from '@modules/schedules/services/findAll.schedule.enduser.service';

@ApiTags('schedules')
@Controller('schedules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class ScheduleController {
  constructor(
    private readonly createScheduleService: CreateScheduleService,
    private readonly findAllScheduleService: FindAllScheduleService,
    private readonly findAllScheduleEndUserService: FindAllScheduleEndUserService,
    private readonly findOneScheduleService: FindOneScheduleService,
    private readonly updateScheduleService: UpdateScheduleService,
    private readonly removeScheduleService: RemoveScheduleService,
  ) {}

  @AuditLog('CRIAR SCHEDULE')
  @Post()
  @ApiOperation({ summary: 'Create Schedule' })
  @Permission(PermissionsEnum.create_schedule)
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.createScheduleService.execute(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Schedule' })
  @Permission(PermissionsEnum.find_all_schedules)
  @Locations()
  findAll(@Req() req: any, @Query() query: IQuerySchedule) {
    const userLocations = req.userLocations;

    if (!query.locations) {
      query.locations = userLocations;
    }

    return this.findAllScheduleService.findAll(query);
  }

  @Get('enduser')
  @ApiOperation({ summary: 'Find all Schedule enduser' })
  @Permission(PermissionsEnum.find_all_schedules_enduser)
  @Locations()
  findAllEnduser(@Query() query: IQuerySchedule) {
    return this.findAllScheduleEndUserService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Schedule' })
  @Permission(PermissionsEnum.find_one_schedule)
  @Locations()
  findOne(@Param('id') id: string) {
    return this.findOneScheduleService.findOne(id);
  }

  @AuditLog('ATUALIZAR SCHEDULE')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Schedule' })
  @Permission(PermissionsEnum.update_schedule)
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.updateScheduleService.update(id, updateScheduleDto);
  }

  @AuditLog('REMOVER SCHEDULE')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Schedule' })
  @Permission(PermissionsEnum.remove_schedule)
  remove(@Param('id') id: string) {
    return this.removeScheduleService.remove(id);
  }
}
