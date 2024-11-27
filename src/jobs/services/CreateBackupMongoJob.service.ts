import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

const execAsync = promisify(exec);

@Injectable()
export class CreateBackupMongoJobService {
  private readonly logger = new Logger(CreateBackupMongoJobService.name);

  constructor(private readonly s3Provider: S3Provider) {}

  private getLocalTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleBackup() {
    this.logger.log('Iniciando backup do MongoDB...');
    let backupPath: string | null = null;

    try {
      const scriptPath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'scripts',
        'database',
        'mongodb',
        'backup.sh',
      );

      const currentDate = new Date().toISOString().split('T')[0];
      const timestamp = this.getLocalTimestamp();
      const expectedBackupPath = resolve(
        'backup',
        'mongodb',
        `mongodb_dump_${timestamp}.gz`,
      );

      const { stderr } = await execAsync(`bash ${scriptPath}`);

      if (stderr) {
        this.logger.error(`Erro no script de backup: ${stderr}`);
        return;
      }

      this.logger.log(`Procurando arquivo de backup em: ${expectedBackupPath}`);

      if (expectedBackupPath) {
        backupPath = expectedBackupPath;
        const fileName = backupPath.split('/').pop();

        // Upload para S3
        const key = `backups/mongodb/${currentDate}/${fileName}`;

        this.logger.log(
          `Tentando fazer upload do arquivo: ${backupPath} para ${key}`,
        );

        try {
          await this.s3Provider.uploadFile(backupPath, key, {
            contentType: 'application/gzip',
            metadata: {
              'database-type': 'mongodb',
              'backup-date': currentDate,
            },
          });

          this.logger.log(`Backup enviado para S3: ${key}`);

          // Remover arquivo local após upload bem-sucedido
          await unlink(backupPath);
          this.logger.log(`Arquivo local removido: ${backupPath}`);
        } catch (error) {
          this.logger.error(`Erro ao enviar para S3: ${error.message}`);
          this.logger.log(`Arquivo de backup mantido em: ${backupPath}`);
          throw error;
        }
      } else {
        throw new Error('Arquivo de backup não encontrado');
      }
    } catch (error) {
      this.logger.error(`Erro ao processar o backup: ${error.message}`);
    }
  }

  async runManualBackup() {
    this.logger.log('Executando backup manual...');
    return this.handleBackup();
  }
}
