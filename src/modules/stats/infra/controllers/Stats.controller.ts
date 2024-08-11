import { ImprovedGetStatsDto } from '@modules/stats/dto/getStats.dto';
import { GetStatsService } from '@modules/stats/services/getStats.service';
import { GetStatsServiceV3 } from '@modules/stats/services/getStatsV3.service ';
import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@shared/decorators';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(
    private readonly getStatsService: GetStatsService,
    private readonly getStatsServiceV3: GetStatsServiceV3,
  ) {}

  @Get()
  @Version('1')
  @Public()
  @ApiOperation({
    summary: 'Get stats (v1)',
    description: 'Get statistics using version 1',
  })
  @ApiResponse({ status: 200, description: 'Returns the stats successfully.' })
  async getStats(@Query() query: ImprovedGetStatsDto) {
    return await this.getStatsService.execute(query);
  }

  @Get()
  @Version('2')
  @Public()
  @ApiOperation({
    summary: 'Get stats (v2)',
    description: 'Get statistics using version 2',
  })
  @ApiResponse({ status: 200, description: 'Returns the stats successfully.' })
  async getStatsV2(@Query() query: ImprovedGetStatsDto) {
    return await this.getStatsServiceV3.execute(query);
  }
}
