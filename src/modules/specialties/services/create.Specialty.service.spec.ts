import { Test, TestingModule } from '@nestjs/testing';
import { CreateSpecialtieservice } from './create.Specialty.service';

describe('CreateSpecialtieservice', () => {
  let service: CreateSpecialtieservice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateSpecialtieservice],
    }).compile();

    service = module.get<CreateSpecialtieservice>(CreateSpecialtieservice);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
