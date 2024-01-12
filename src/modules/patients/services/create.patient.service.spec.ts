import { Test, TestingModule } from '@nestjs/testing';
import { CreatePatientService } from './create.patient.service';

describe('CreatePatientService', () => {
  let service: CreatePatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatePatientService],
    }).compile();

    service = module.get<CreatePatientService>(CreatePatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
