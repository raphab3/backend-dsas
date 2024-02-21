import { CreateDependentService } from '../../services/create.dependent.service';
import { FindAllDependentService } from '../../services/findAll.dependent.service';
import { FindOneDependentService } from '../../services/findOne.dependent.service';
import { RemoveDependentService } from '../../services/remove.dependent.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateDependentService } from '../../services/update.dependent.service';
import { DependentController } from './dependent.controller';

describe('DependentController', () => {
  let controller: DependentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DependentController],
      providers: [
        CreateDependentService,
        FindAllDependentService,
        FindOneDependentService,
        UpdateDependentService,
        RemoveDependentService,
      ],
    }).compile();

    controller = module.get<DependentController>(DependentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
