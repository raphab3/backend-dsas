import { Module } from '@nestjs/common';
import { JobController } from './controller/JobController';
import { CreateBackupMongoJobService } from './services/CreateBackupMongoJob.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CreateBackupPostgresJobService } from './services/CreateBackupJob.service';
import { ProvidersModule } from '@shared/providers/providers.module';

@Module({
  controllers: [JobController],
  providers: [CreateBackupPostgresJobService, CreateBackupMongoJobService],
  imports: [ScheduleModule.forRoot(), ProvidersModule],
})
export class JobModule {}
