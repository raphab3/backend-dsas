import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import CreateBackupJobService from '../services/CreateBackupJob.service';
import { Public } from '@shared/decorators';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(
    private readonly createBackupJobService: CreateBackupJobService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '[JOB]: Backup database' })
  backupJob() {
    return this.createBackupJobService.run();
  }
}
