import { Test, TestingModule } from '@nestjs/testing';
import { CreateUsersService } from './create.users.service';

describe('CreateUsersService', () => {
  let service: CreateUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUsersService],
    }).compile();

    service = module.get<CreateUsersService>(CreateUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
