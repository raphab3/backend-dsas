import { Module } from '@nestjs/common';
import { JobController } from './controller/JobController';
import CreateBackupJobService from './services/CreateBackupJob.service';

@Module({
  controllers: [JobController],
  providers: [CreateBackupJobService],
  imports: [],
})
export class JobModule {}
