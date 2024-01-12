import { Injectable } from '@nestjs/common';
import { UpdateAttachmentDto } from '../dto/update-attachment.dto';

@Injectable()
export class UpdateAttachmentService {
  update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    return `This action updates a #${id} Attachment`;
  }
}
