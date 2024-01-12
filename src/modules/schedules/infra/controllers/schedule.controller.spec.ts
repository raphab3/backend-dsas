import { CreateScheduleService } from '../../services/create.schedule.service';
import { FindAllScheduleService } from '../../services/findAll.schedule.service';
import { FindOneScheduleService } from '../../services/findOne.schedule.service';
import { RemoveScheduleService } from '../../services/remove.schedule.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateScheduleService } from '../../services/update.schedule.service';
import { ScheduleController } from './schedule.controller';

describe('ScheduleController', () => {
  let controller: ScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        CreateScheduleService,
        FindAllScheduleService,
        FindOneScheduleService,
        UpdateScheduleService,
        RemoveScheduleService,
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
