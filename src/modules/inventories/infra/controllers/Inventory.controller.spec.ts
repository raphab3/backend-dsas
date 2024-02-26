import { createInventoryService } from '@modules/inventories/services/create.Inventory.service';
import { FindAllInventaryService } from '@modules/inventories/services/findAll.Inventory.service';
import { FindOneInventaryService } from '@modules/inventories/services/findOne.Inventory.service';
import { RemoveInventaryService } from '@modules/inventories/services/remove.Inventory.service';
import { UpdateInventaryService } from '@modules/inventories/services/update.Inventory.service';
import { SpecialtyController } from '@modules/specialties/infra/controllers/Specialty.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('SpecialtyController', () => {
  let controller: SpecialtyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialtyController],
      providers: [
        createInventoryService,
        FindAllInventaryService,
        FindOneInventaryService,
        UpdateInventaryService,
        RemoveInventaryService,
      ],
    }).compile();

    controller = module.get<SpecialtyController>(SpecialtyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
