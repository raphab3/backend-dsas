import { CreateAttachmentDto } from '@modules/attachments/dto/create-attachment.dto';
import { Attachment } from '../entities/attachment.entity';

export default interface IAttachmentRepository {
  create(data: CreateAttachmentDto): Promise<Attachment>;
}
