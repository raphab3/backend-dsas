import { CreateInventaryService } from '@modules/inventories/services/create.Inventary.service';
import { FindAllInventaryService } from '@modules/inventories/services/findAll.Inventary.service';
import { FindOneInventaryService } from '@modules/inventories/services/findOne.Inventary.service';
import { RemoveInventaryService } from '@modules/inventories/services/remove.Inventary.service';
import { UpdateInventaryService } from '@modules/inventories/services/update.Inventary.service';
import { SpecialtyController } from '@modules/specialties/infra/controllers/Specialty.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('SpecialtyController', () => {
  let controller: SpecialtyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialtyController],
      providers: [
        CreateInventaryService,
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
