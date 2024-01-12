import { Test, TestingModule } from '@nestjs/testing';
import { CreatePersonSigService } from './create.personSig.service';

describe('CreatePersonSigService', () => {
  let service: CreatePersonSigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatePersonSigService],
    }).compile();

    service = module.get<CreatePersonSigService>(CreatePersonSigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
