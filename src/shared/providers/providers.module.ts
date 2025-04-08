import { forwardRef, Module } from '@nestjs/common';
import CryptoHashProvider from './HashProvider/implementations/CryptoHashProvider';
import AuditModule from '@modules/audits/Audit.module';
import { S3Provider } from './StorageProvider/services/S3StorageProvider';

const HashProvider = {
  provide: 'HashProvider',
  useClass: CryptoHashProvider,
};

const providers = [HashProvider, S3Provider];

const forwardRefModules = [forwardRef(() => AuditModule)];

@Module({
  controllers: [],
  providers: [...providers],
  imports: [...forwardRefModules],
  exports: [...providers],
})
export class ProvidersModule {}
