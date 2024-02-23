import { FindAllAuditService } from '../../services/findAll.Audit.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './Audit.controller';

describe('AuditController', () => {
  let controller: AuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [FindAllAuditService],
    }).compile();

    controller = module.get<AuditController>(AuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
