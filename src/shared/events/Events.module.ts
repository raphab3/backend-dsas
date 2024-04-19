import { Module } from '@nestjs/common';
import { EventsService } from './EventsService';

@Module({
  imports: [],
  providers: [EventsService],
  controllers: [],
  exports: [EventsService],
})
export class EventsModule {}
