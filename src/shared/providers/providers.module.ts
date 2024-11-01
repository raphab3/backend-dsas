import { forwardRef, Module } from '@nestjs/common';
import CryptoHashProvider from './HashProvider/implementations/CryptoHashProvider';
import AuditModule from '@modules/audits/Audit.module';

const HashProvider = {
  provide: 'HashProvider',
  useClass: CryptoHashProvider,
};

const providers = [HashProvider];

const forwardRefModules = [forwardRef(() => AuditModule)];

@Module({
  controllers: [],
  providers: [...providers],
  imports: [...forwardRefModules],
  exports: [...providers],
})
export class ProvidersModule {}
