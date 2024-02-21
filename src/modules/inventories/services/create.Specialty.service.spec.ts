import { CreateSpecialtieservice } from '@modules/specialties/services/create.Specialty.service';
import { Test, TestingModule } from '@nestjs/testing';

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
