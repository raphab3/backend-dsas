import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfessionalService } from './create.professional.service';

describe('CreateProfessionalService', () => {
  let service: CreateProfessionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateProfessionalService],
    }).compile();

    service = module.get<CreateProfessionalService>(CreateProfessionalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
