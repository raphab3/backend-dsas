import Attachment from '../entities/Attachment';
import IAttachment from '../interfaces/IAttachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class FindByIdAttachmentsUseCase {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
  ) {}

  public async execute(id: string): Promise<IAttachment | null> {
    const result = await this.attachmentsRepository.findOne({
      where: { id },
    });
    return result;
  }
}
