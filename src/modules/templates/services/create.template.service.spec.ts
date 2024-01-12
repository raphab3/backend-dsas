import { Test, TestingModule } from '@nestjs/testing';
import { CreateTemplateService } from './create.template.service';

describe('CreateTemplateService', () => {
  let service: CreateTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTemplateService],
    }).compile();

    service = module.get<CreateTemplateService>(CreateTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
