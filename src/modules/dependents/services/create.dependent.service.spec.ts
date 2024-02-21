import { Test, TestingModule } from '@nestjs/testing';
import { CreateDependentService } from './create.dependent.service';

describe('CreateDependentService', () => {
  let service: CreateDependentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateDependentService],
    }).compile();

    service = module.get<CreateDependentService>(CreateDependentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
