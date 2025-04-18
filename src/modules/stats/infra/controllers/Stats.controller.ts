import { ImprovedGetStatsDto } from '@modules/stats/dto/getStats.dto';
import { GetAttendanceStatsDto } from '@modules/stats/dto/getAttendanceStats.dto';
import { GetStatsService } from '@modules/stats/services/getStats.service';
import { GetAttendanceStatsService } from '@modules/stats/services/getAttendanceStats.service';
import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@shared/decorators';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(
    private readonly getStatsService: GetStatsService,
    private readonly getAttendanceStatsService: GetAttendanceStatsService,
  ) {}

  @Get()
  @Version('1')
  @Public()
  @ApiOperation({
    summary: 'Get stats (v1)',
    description: 'Get statistics using version 1',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the stats successfully.',
  })
  async getStats(@Query() query: ImprovedGetStatsDto) {
    return await this.getStatsService.execute(query);
  }

  @Get('attendances')
  @Version('1')
  @Public()
  @ApiOperation({
    summary: 'Get attendance stats (v1)',
    description: 'Get attendance statistics using version 1',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the attendance stats successfully.',
  })
  async getAttendanceStats(@Query() query: GetAttendanceStatsDto) {
    return await this.getAttendanceStatsService.execute(query);
  }
}
