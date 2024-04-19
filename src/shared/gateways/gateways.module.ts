import { Module } from '@nestjs/common';
import { StatisticsGateway } from './StatisticsGateway';
import { EventsModule } from '@shared/events/Events.module';

@Module({
  imports: [EventsModule],
  providers: [StatisticsGateway],
  controllers: [],
  exports: [StatisticsGateway],
})
export class GatewaysModule {}
