import { CreateAssetService } from '@modules/inventories/services/create.Asset.service';
import { FindAllAssetService } from '@modules/inventories/services/findAll.Asset.service';
import { FindOneAssetService } from '@modules/inventories/services/findOne.Asset.service';
import { RemoveAssetService } from '@modules/inventories/services/remove.Asset.service';
import { UpdateAssetService } from '@modules/inventories/services/update.Asset.service';
import { SpecialtyController } from '@modules/specialties/infra/controllers/Specialty.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('SpecialtyController', () => {
  let controller: SpecialtyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialtyController],
      providers: [
        CreateAssetService,
        FindAllAssetService,
        FindOneAssetService,
        UpdateAssetService,
        RemoveAssetService,
      ],
    }).compile();

    controller = module.get<SpecialtyController>(SpecialtyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
