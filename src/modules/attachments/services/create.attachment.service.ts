import { Inject, Injectable } from '@nestjs/common';
import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import IAttachmentRepository from '../typeorm/repositories/IAttachmentRepository';

@Injectable()
export class CreateAttachmentService {
  constructor(
    @Inject('AttachmentRepository')
    private readonly attachmentRepository: IAttachmentRepository,
  ) {}

  async execute(createAttachmentDto: CreateAttachmentDto) {
    return await this.attachmentRepository.create(createAttachmentDto);
  }
}
