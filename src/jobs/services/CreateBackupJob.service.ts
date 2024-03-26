import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { resolve } from 'path';
@Injectable()
class CreateBackupJobService {
  async run() {
    console.log('Backup job running...');
    console.log(`Diretório de trabalho atual: ${process.cwd()}`);

    const scriptPath = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'scripts',
      'database',
      'backup.sh',
    );

    exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar o script de backup: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Erro no script de backup: ${stderr}`);
        return;
      }
      console.log(`Saída do script de backup: ${stdout}`);
    });
  }
}

export default CreateBackupJobService;
