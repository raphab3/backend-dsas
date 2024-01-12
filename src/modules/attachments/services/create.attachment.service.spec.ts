import { Test, TestingModule } from '@nestjs/testing';
import { CreateAttachmentService } from './create.attachment.service';

describe('CreateAttachmentService', () => {
  let service: CreateAttachmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAttachmentService],
    }).compile();

    service = module.get<CreateAttachmentService>(CreateAttachmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
