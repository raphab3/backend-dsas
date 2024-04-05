import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { GetStatsService } from '@modules/stats/services/getStats.service';
import { Public } from '@shared/decorators';
import { GetStatsDto } from '@modules/stats/dto/getStats.dto';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly getStatsService: GetStatsService) {}

  @Get()
  @Public()
  async getStats(@Query() query: GetStatsDto) {
    return await this.getStatsService.execute(query);
  }
}
