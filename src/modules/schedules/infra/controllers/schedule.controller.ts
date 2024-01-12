import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
} from '@nestjs/common';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly createScheduleService: CreateScheduleService,
    private readonly findAllScheduleService: FindAllScheduleService,
    private readonly findOneScheduleService: FindOneScheduleService,
    private readonly updateScheduleService: UpdateScheduleService,
    private readonly removeScheduleService: RemoveScheduleService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Schedule' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.createScheduleService.execute(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.findAllScheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Schedule' })
  findOne(@Param('id') id: string) {
    return this.findOneScheduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.updateScheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeScheduleService.remove(id);
  }
}
