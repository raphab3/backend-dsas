import IAttachmentRepository from './IAttachmentRepository';
import { CreateAttachmentDto } from '@modules/attachments/dto/create-attachment.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from '../entities/attachment.entity';

@Injectable()
class AttachmentRepository implements IAttachmentRepository {
  constructor(
    @InjectRepository(Attachment)
    private ormRepository: Repository<Attachment>,
  ) {}

  public async create(userData: CreateAttachmentDto): Promise<Attachment> {
    const attachment = this.ormRepository.create(userData);
    await this.ormRepository.save(attachment);
    return attachment;
  }
}

export default AttachmentRepository;
