import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { GetStatsService } from '@modules/stats/services/getStats.service';
import { Public } from '@shared/decorators';
import { GetStatsDto } from '@modules/stats/dto/getStats.dto';
import { GetStatsServiceV2 } from '@modules/stats/services/getStatsV2.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(
    private readonly getStatsService: GetStatsService,
    private readonly getStatsServiceV2: GetStatsServiceV2,
  ) {}

  @Get()
  @Public()
  async getStats(@Query() query: GetStatsDto) {
    return await this.getStatsService.execute(query);
  }

  @Get('v2')
  @Public()
  async getStatsV2(@Query() query: GetStatsDto) {
    return await this.getStatsServiceV2.execute(query);
  }
}
