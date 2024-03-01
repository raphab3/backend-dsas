import { CreateLocationService } from '../../services/create.location.service';
import { FindAllLocationService } from '../../services/findAll.location.service';
import { FindOneLocationService } from '../../services/findOne.location.service';
import { RemoveLocationService } from '../../services/remove.location.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateLocationService } from '../../services/update.location.service';
import { LocationController } from './location.controller';

describe('LocationController', () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        CreateLocationService,
        FindAllLocationService,
        FindOneLocationService,
        UpdateLocationService,
        RemoveLocationService,
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
