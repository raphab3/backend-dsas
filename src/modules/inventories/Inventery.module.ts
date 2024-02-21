import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventary } from './typeorm/entities/Inventary.entity';
import { InventaryController } from './infra/controllers/Inventary.controller';
import InventaryRepository from './typeorm/repositories/InventaryRepository';
import { CreateInventaryService } from './services/create.Inventary.service';
import { FindAllInventaryService } from './services/findAll.Inventary.service';
import { FindOneInventaryService } from './services/findOne.Inventary.service';
import { RemoveInventaryService } from './services/remove.Inventary.service';
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
  imports: [TYPE_ORM_TEMPLATES],
  exports: [InventaryRepository],
})
export class InvetaryModule {}
