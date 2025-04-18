import Attachment from '../entities/Attachment';
import IAttachment from '../interfaces/IAttachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryAttachmentDto } from '../dtos/QueryAttachmentDto';
import { Repository } from 'typeorm';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

@Injectable()
export default class ListAttachmentsUseCase {
  private timeExpired = 12 * 60 * 60;

  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
    private storageProvider: S3Provider,
  ) {}

  public async execute(
    query: QueryAttachmentDto,
  ): Promise<IPaginatedResult<IAttachment>> {
    const attachments = await this.list(query);

    for await (const attachment of attachments.data) {
      if (attachment.path) {
        attachment.file_url = await this.getAttachmentPresignedUrl(
          attachment,
          this.timeExpired,
        );
      }
    }

    return attachments;
  }

  private async list(
    query: QueryAttachmentDto,
  ): Promise<IPaginatedResult<IAttachment>> {
    let page = 1;
    let perPage = 10;

    const attachmentCreateQueryBuilder = this.attachmentsRepository
      .createQueryBuilder('attachments')
      .orderBy('attachments.created_at', 'DESC');

    if (query.id) {
      attachmentCreateQueryBuilder.where('attachments.id = :id', {
        id: query.id,
      });
    }

    if (query.type) {
      attachmentCreateQueryBuilder.where(
        'attachments.attachment_type = :attachment_type',
        {
          attachment_type: query.type,
        },
      );
    }

    if (query) {
      if (query.page) page = query.page;
      if (query.perPage) perPage = query.perPage;
    }

    const result = await paginate(attachmentCreateQueryBuilder, {
      page,
      perPage,
    });

    return result;
  }

  private async getAttachmentPresignedUrl(
    attachment: IAttachment,
    timeExpired: number,
  ): Promise<string> {
    return await this.storageProvider.getSignedUrl(
      attachment.path,
      timeExpired,
    );
  }
}
