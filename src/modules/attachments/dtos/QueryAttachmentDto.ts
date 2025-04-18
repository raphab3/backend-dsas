import { ApiProperty } from '@nestjs/swagger';
import { IQuery } from '@shared/interfaces/IQuery';
import { AttachmentsEnuns, AttachmentsType } from '../interfaces/IAttachment';

export class QueryAttachmentDto extends IQuery {
  @ApiProperty({
    description: 'Tipo do anexo',
    enum: AttachmentsEnuns,
    required: false,
  })
  type: AttachmentsType;
}
