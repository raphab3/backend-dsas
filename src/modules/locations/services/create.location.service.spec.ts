import { Test, TestingModule } from '@nestjs/testing';
import { CreateLocationService } from './create.location.service';

describe('CreateLocationService', () => {
  let service: CreateLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateLocationService],
    }).compile();

    service = module.get<CreateLocationService>(CreateLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
