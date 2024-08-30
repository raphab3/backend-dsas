import { CreateTraineeService } from '../../services/create.trainee.service';
import { FindAllTraineeService } from '../../services/findAll.trainee.service';
import { FindOneTraineeService } from '../../services/findOne.trainee.service';
import { RemoveTraineeService } from '../../services/remove.trainee.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTraineeService } from '../../services/update.trainee.service';
import { TraineeController } from './trainee.controller';

describe('TraineeController', () => {
  let controller: TraineeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TraineeController],
      providers: [
        CreateTraineeService,
        FindAllTraineeService,
        FindOneTraineeService,
        UpdateTraineeService,
        RemoveTraineeService,
      ],
    }).compile();

    controller = module.get<TraineeController>(TraineeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
