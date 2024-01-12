import AttachmentRepository from './typeorm/repositories/AttachmentRepository';
import { CreateAttachmentService } from './services/create.attachment.service';
import { FindAllAttachmentService } from './services/findAll.attachment.service';
import { FindOneAttachmentService } from './services/findOne.attachment.service';
import { Module } from '@nestjs/common';
import { RemoveAttachmentService } from './services/remove.attachment.service';
import { Attachment } from './typeorm/entities/attachment.entity';
import { AttachmentController } from './infra/controllers/attachment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateAttachmentService } from './services/update.attachment.service';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Attachment]);

@Module({
  controllers: [AttachmentController],
  providers: [
    AttachmentRepository,
    FindOneAttachmentService,
    CreateAttachmentService,
    FindAllAttachmentService,
    UpdateAttachmentService,
    RemoveAttachmentService,
  ],
  imports: [TYPE_ORM_TEMPLATES],
})
export class AttachmentModule {}
