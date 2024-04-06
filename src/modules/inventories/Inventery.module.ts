import InventaryRepository from './typeorm/repositories/InventaryRepository';
import { CreateInventoryService } from './services/create.Inventory.service';
import { FindAllInventoryService } from './services/findAll.Inventory.service';
import { FindOneInventoryService } from './services/findOne.Inventory.service';
import { Inventory } from './typeorm/entities/Inventory.entity';
import { InventoryController } from './infra/controllers/Inventory.controller';
import { Module } from '@nestjs/common';
import { RemoveInventoryService } from './services/remove.Inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateInventoryService } from './services/update.Inventory.service';
import AuditModule from '@modules/audits/Audit.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Inventory]);

@Module({
  controllers: [InventoryController],
  providers: [
    InventaryRepository,
    CreateInventoryService,
    FindAllInventoryService,
    FindOneInventoryService,
    UpdateInventoryService,
    RemoveInventoryService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
  exports: [InventaryRepository],
})
export class InvetaryModule {}
