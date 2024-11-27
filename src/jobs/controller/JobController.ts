import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { Public } from '@shared/decorators';
import { CreateBackupMongoJobService } from '../services/CreateBackupMongoJob.service';
import { CreateBackupPostgresJobService } from '../services/CreateBackupJob.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(
    private readonly createBackupPostgresJobService: CreateBackupPostgresJobService,
    private readonly createBackupMongoJobService: CreateBackupMongoJobService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '[JOB]: Backup postgres database' })
  async runBackup() {
    // Iniciar o backup em background e retornar imediatamente
    this.createBackupPostgresJobService.runManualBackup().catch((error) => {
      console.error('Erro no backup em background:', error);
    });

    return { message: 'Backup iniciado em background' };
  }

  @Get('mongo')
  @Public()
  @ApiOperation({ summary: '[JOB]: Backup mongo database' })
  backupMongoJob() {
    return this.createBackupMongoJobService.runManualBackup();
  }
}
