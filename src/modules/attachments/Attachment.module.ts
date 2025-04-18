import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersModule } from '@shared/providers/providers.module';
import Attachment from './entities/Attachment';
import AttachmentController from './controllers/Attachment.controller.ts';
import CreateAttachmentService from './services/CreateAttachment.service';
import CreateByRequestService from './services/CreateByRequest.service';
import DeleteAttachmentService from './services/DeleteAttachment.service';
import ListAttachmentsService from './services/ListAttachments.service';
import UpdateAttachmentService from './services/UpdateAttachment.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Attachment]);

@Module({
  controllers: [AttachmentController],
  providers: [
    ListAttachmentsService,
    CreateAttachmentService,
    CreateByRequestService,
    DeleteAttachmentService,
    UpdateAttachmentService,
  ],
  imports: [TYPE_ORM_TEMPLATES, ProvidersModule],
  exports: [
    ListAttachmentsService,
    CreateAttachmentService,
    CreateByRequestService,
    DeleteAttachmentService,
    UpdateAttachmentService,
  ],
})
export class AttachmentModule {}
