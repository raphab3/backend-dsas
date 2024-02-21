import { Test, TestingModule } from '@nestjs/testing';
import { CreateAssetService } from './create.Asset.service';

describe('CreateAssetservice', () => {
  let service: CreateAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAssetService],
    }).compile();

    service = module.get<CreateAssetService>(CreateAssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
