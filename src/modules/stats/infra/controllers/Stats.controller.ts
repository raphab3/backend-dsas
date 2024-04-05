import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req } from '@nestjs/common';
import { GetStatsService } from '@modules/stats/services/getStats.service';
import { Public } from '@shared/decorators';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly getStatsService: GetStatsService) {}

  @Get()
  @Public()
  async getStats(@Req() req: any) {
    return await this.getStatsService.execute(req.query);
  }
}
