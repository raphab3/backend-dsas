import { Module } from '@nestjs/common';
import { TYPE_ORM_MODULE } from './providers/postgresDB';
import { MONGO_MODULE } from './providers/mongoDB';

@Module({
  imports: [TYPE_ORM_MODULE, MONGO_MODULE],
  providers: [],
  controllers: [],
  exports: [],
})
export class DatabasesModule {}
