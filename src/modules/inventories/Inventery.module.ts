import InventaryRepository from './typeorm/repositories/InventaryRepository';
import { AuditModule } from '@modules/audits/Audit.module';
import { CreateInventaryService } from './services/create.Inventary.service';
import { FindAllInventaryService } from './services/findAll.Inventary.service';
import { FindOneInventaryService } from './services/findOne.Inventary.service';
import { Inventary } from './typeorm/entities/Inventary.entity';
import { InventaryController } from './infra/controllers/Inventary.controller';
import { Module } from '@nestjs/common';
import { RemoveInventaryService } from './services/remove.Inventary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateInventaryService } from './services/update.Inventary.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Inventary]);

@Module({
  controllers: [InventaryController],
  providers: [
    InventaryRepository,
    CreateInventaryService,
    FindAllInventaryService,
    FindOneInventaryService,
    UpdateInventaryService,
    RemoveInventaryService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
  exports: [InventaryRepository],
})
export class InvetaryModule {}
