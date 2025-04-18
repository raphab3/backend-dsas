import { ApiProperty } from '@nestjs/swagger';
import { AttachmentsEnuns, AttachmentsType } from '../interfaces/IAttachment';

export class CreateAttachmentDto {
  @ApiProperty({
    description: 'Arquivo a ser carregado',
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: any;

  @ApiProperty({
    description: 'Tipo do anexo',
    enum: AttachmentsEnuns,
    required: true,
  })
  attachment_type: AttachmentsType;
}
