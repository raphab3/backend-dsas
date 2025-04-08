import { Module } from '@nestjs/common';
import { TelegramBotService } from './services/TelegramBot.service';

@Module({
  imports: [],
  providers: [TelegramBotService],
  controllers: [],
  exports: [TelegramBotService],
})
export class NotificationsModule {}
