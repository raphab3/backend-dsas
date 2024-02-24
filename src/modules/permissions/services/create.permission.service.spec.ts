import { Test, TestingModule } from '@nestjs/testing';
import { CreatePermissionService } from './create.permission.service';

describe('CreatePermissionService', () => {
  let service: CreatePermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatePermissionService],
    }).compile();

    service = module.get<CreatePermissionService>(CreatePermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
