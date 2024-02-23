import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuditService } from './AuditService';

describe('CreateAuditService', () => {
  let service: CreateAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAuditService],
    }).compile();

    service = module.get<CreateAuditService>(CreateAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
