import { CreateAttachmentService } from '../../services/create.attachment.service';
import { FindAllAttachmentService } from '../../services/findAll.attachment.service';
import { FindOneAttachmentService } from '../../services/findOne.attachment.service';
import { RemoveAttachmentService } from '../../services/remove.attachment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAttachmentService } from '../../services/update.attachment.service';
import { AttachmentController } from './attachment.controller';

describe('AttachmentController', () => {
  let controller: AttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentController],
      providers: [
        CreateAttachmentService,
        FindAllAttachmentService,
        FindOneAttachmentService,
        UpdateAttachmentService,
        RemoveAttachmentService,
      ],
    }).compile();

    controller = module.get<AttachmentController>(AttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
