import { Test, TestingModule } from '@nestjs/testing';
import { CreateAddressService } from './create.address.service';

describe('CreateAddressService', () => {
  let service: CreateAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAddressService],
    }).compile();

    service = module.get<CreateAddressService>(CreateAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
