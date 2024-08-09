import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [],
  providers: [],
  imports: [
    CacheModule.register({
      ttl: 3600000, // 1 hour
      max: 100, // maximum number of items in cache
      isGlobal: true,
    }),
  ],
  exports: [],
})
export class CacheModuleCustom {}
