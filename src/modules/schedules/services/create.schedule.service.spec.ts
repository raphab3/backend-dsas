import { Test, TestingModule } from '@nestjs/testing';
import { CreateScheduleService } from './create.schedule.service';

describe('CreateScheduleService', () => {
  let service: CreateScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateScheduleService],
    }).compile();

    service = module.get<CreateScheduleService>(CreateScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
