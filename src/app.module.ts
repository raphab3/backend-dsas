import { ConfigModule } from '@nestjs/config';
import { ALL_MODULES, PROVIDERS } from './config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...ALL_MODULES,
  ],
  providers: [...PROVIDERS],
  controllers: [],
  exports: [],
})
export class AppModule {}
