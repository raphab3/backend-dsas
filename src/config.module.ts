import env from '@config/env';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { QueryFailedFilter } from '@shared/QueryFailedFilter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TimeoutInterceptor } from '@shared/interceptors/TimeoutInterceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { PermissionsGuard } from '@shared/guards/PermissionsGuard';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const TYPE_ORM = TypeOrmModule.forRoot({
  ...databaseConfig,
});

export const RATE_LIMIT = ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 100,
  },
]);

export const PROVIDERS = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_FILTER,
    useClass: QueryFailedFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TimeoutInterceptor,
  },
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: PermissionsGuard,
  },
];

export const CONFIGS_MODULES = [TYPE_ORM, RATE_LIMIT];
