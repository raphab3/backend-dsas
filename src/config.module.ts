import env from '@config/env';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './guards/RolesGuard';

export const TYPE_ORM = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
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
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
];

export const CONFIGS_MODULES = [TYPE_ORM, RATE_LIMIT];
