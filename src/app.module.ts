import { ALL_MODULES, PROVIDERS } from './config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [...ALL_MODULES],
  providers: [...PROVIDERS],
  controllers: [],
  exports: [],
})
export class AppModule {}
