import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuthService } from './create.auth.service';

describe('CreateAuthService', () => {
  let service: CreateAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAuthService],
    }).compile();

    service = module.get<CreateAuthService>(CreateAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
