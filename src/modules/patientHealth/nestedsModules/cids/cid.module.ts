import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cid } from './entities/cid.entity';
import { CidController } from './controllers/cid.controller';
import { CreateCidService } from './services/create-cid.service';
import { FindAllCidsService } from './services/find-all-cids.service';
import { FindOneCidService } from './services/find-one-cid.service';
import { ImportCidsService } from './services/import-cids.service';
import AuditModule from '@modules/audits/Audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cid]), AuditModule],
  controllers: [CidController],
  providers: [
    CreateCidService,
    FindAllCidsService,
    FindOneCidService,
    ImportCidsService,
  ],
  exports: [
    CreateCidService,
    FindAllCidsService,
    FindOneCidService,
    ImportCidsService,
  ],
})
export class CidModule {}
