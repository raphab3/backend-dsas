import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { unlink } from 'fs/promises';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { TelegramBotService } from '@shared/providers/Notification/services/TelegramBot.service';
import env from '@config/env';

const execAsync = promisify(exec);

@Injectable()
export class CreateBackupPostgresJobService {
  private readonly logger = new Logger(CreateBackupPostgresJobService.name);

  constructor(
    private readonly s3Provider: S3Provider,
    private readonly telegram: TelegramBotService,
  ) {}

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
    this.logger.log('Iniciando backup do PostgreSQL...');
    let backupPath: string | null = null;

    try {
      const scriptPath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'scripts',
        'database',
        'postgresql',
        'backup.sh',
      );

      const currentDate = new Date().toISOString().split('T')[0];
      const timestamp = this.getLocalTimestamp();
      const expectedBackupPath = resolve('backup', `db_dump_${timestamp}.sql`);

      const { stderr } = await execAsync(`bash ${scriptPath}`);

      if (stderr) {
        this.logger.error(`Erro no script de backup: ${stderr}`);
        return;
      }

      this.logger.log(`Procurando arquivo de backup em: ${expectedBackupPath}`);

      // Verificar se o arquivo existe
      if (expectedBackupPath) {
        backupPath = expectedBackupPath;
        const fileName = backupPath.split('/').pop();

        // Upload para S3
        const key = `backups/postgres/${currentDate}/${fileName}`;

        this.logger.log(
          `Tentando fazer upload do arquivo: ${backupPath} para ${key}`,
        );
        try {
          await this.s3Provider.uploadFile(backupPath, key, {
            contentType: 'application/sql',
            metadata: {
              'database-type': 'postgres',
              'backup-date': currentDate,
            },
          });

          this.logger.log(`Backup enviado para S3: ${key}`);

          // Only remove the file if upload was successful
          await unlink(backupPath);
          this.logger.log(`Arquivo local removido: ${backupPath}`);

          await this.telegram.sendMessage(
            `✅ Backup do banco concluído com sucesso!\n\n` +
              `🕒 Data: ${new Date().toLocaleString()}\n` +
              `🗄️ Backup armazenado com segurança 🔒`,
            env.API_TELEGRAM_CHAT_ID,
          );
        } catch (error) {
          this.logger.error(`Erro ao enviar para S3: ${error.message}`);
          this.logger.log(`Arquivo de backup mantido em: ${backupPath}`);
          // Re-throw the error to be caught by the outer catch block
          throw error;
        }
      } else {
        throw new Error('Arquivo de backup não encontrado');
      }
    } catch (error) {
      this.logger.error(`Erro ao processar o backup: ${error.message}`);
      if (backupPath) {
        try {
          await unlink(backupPath);
          this.logger.log(`Arquivo local removido após erro: ${backupPath}`);
        } catch (unlinkError) {
          this.logger.error(
            `Erro ao remover arquivo local: ${unlinkError.message}`,
          );
        }
      }
    }
  }

  async runManualBackup() {
    this.logger.log('Executando backup manual...');
    return this.handleBackup();
  }
}
