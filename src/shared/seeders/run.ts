import 'dotenv/config';
import { AppModule } from '../../app.module';
import { SyncPermissionsService } from './services/SyncPermissions.service';
import { LocationSeedService } from './services/Location.seed.service';
import { NestFactory } from '@nestjs/core';
import { SyncPermissionsInRolesService } from './services/SyncPermissionsInRoles.service';
import { GenerateRolesService } from './services/GenerateRoles.service';
import { DistributionsLocationsForAllPersonsSigService } from './services/distributionsLocationsForAllPersonsSig.service';
import { CitiesGeneratesService } from './services/CitiesGenerates.service';
import { ImportCidsService } from '@modules/cids/services/import-cids.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const args = process.argv.slice(2); // Remove os dois primeiros argumentos (node e path do script)
  const seedOption = args[0]; // O primeiro argumento após o comando
  console.log('seedOption', seedOption);
  const uf = args[1]; // O segundo argumento após o comando

  switch (seedOption) {
    case '0':
      /*
       * Executa o serviço de seed de Gerar roles
       * Usa o serviço GenerateRolesService
       * Usado para popular dados de roles no banco de dados
       * */
      console.log('Executando GenerateRolesService...');
      const seederGenerateRolesService = app.get(GenerateRolesService);
      await seederGenerateRolesService.execute();

      break;
    case '1':
      /*
       * Executa o serviço de sincronização de permissões
       * Usa o serviço SyncPermissionsService
       * Usado para criar as permissões no banco de dados
       * Usa a lista PermissionsEnum para sincronizar as permissões
       * */
      console.log('Executando GeneratePermissionsService...');
      const seederSyncPermissionsService = app.get(SyncPermissionsService);
      await seederSyncPermissionsService.execute();
      break;
    case '2':
      /*
       * Executa o serviço de sincronização de permissões em roles
       * Usa o serviço SyncPermissionsInRolesService
       * Usado para sincronizar as permissões nas roles
       * Usa a lista groupsOfPermissions para sincronizar as permissões nas roles
       * */
      console.log('Executando SyncPermissionsInRolesService...');
      const seederRoles = app.get(SyncPermissionsInRolesService);
      await seederRoles.execute();
      break;
    case '3':
      /*
       * Executa o serviço de seed de localização
       * Usa o serviço LocationSeedService
       * Usado para popular dados de localização no banco de dados
       * */
      console.log('Executando LocationSeedService...');
      const seederLocation = app.get(LocationSeedService);
      await seederLocation.execute();
      break;

    case '4':
      /*
       * Executa o serviço de seed de distribuição de localização para todas as pessoas
       * Usa o serviço DistributionsLocationsForAllPersonsSigService
       * Usado para popular dados de localização para todas as pessoas no banco de dados
       * */
      console.log(
        'Executando DistributionsLocationsForAllPersonsSigService...',
      );
      const seederDistributionsLocationsForAllPersonsSigService = app.get(
        DistributionsLocationsForAllPersonsSigService,
      );
      await seederDistributionsLocationsForAllPersonsSigService.execute();
      break;

    case '5':
      /*
       * Executa o serviço de seed de distribuição de localização para todas as pessoas
       * Usa o serviço DistributionsLocationsForAllPersonsSigService
       * Usado para popular dados de localização para todas as pessoas no banco de dados
       * */

      if (!uf) {
        console.log('Informe a UF para gerar as cidades');
        process.exit(1);
      }

      console.log('Executando CitiesGeneratesService...');
      const citiesGeneratesService = app.get(CitiesGeneratesService);
      await citiesGeneratesService.execute({ uf });
      break;
    case '6':
      /*
       * Executa o serviço de seed de CIDs
       * Usa o serviço CidSeederService
       * Usado para popular dados de CIDs no banco de dados
       * */
      console.log('Executando ImportCidsService...');
      const importCidsService = app.get(ImportCidsService);
      await importCidsService.execute();
      break;
    default:
      console.log('Escolha uma opção válida para executar a seed.');
      break;
  }

  await app.close();
}

bootstrap().catch((error) => {
  console.error('Erro ao executar a seed', error);
  process.exit(1);
});
