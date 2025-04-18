import Attachment from '../entities/Attachment';
import IAttachment, { AttachmentsType } from '../interfaces/IAttachment';
import { ICreateAttachment } from '../interfaces/CreateAttachment';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

@Injectable()
export default class CreateByRequestService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
    private storageProvider: S3Provider,
  ) {}

  public async execute(
    file: ICreateAttachment,
    file_type: AttachmentsType,
  ): Promise<IAttachment> {
    if (!file) {
      throw new HttpException('Arquivo não encontrado', 400);
    }

    const newAttachment: ICreateAttachment = {
      fieldname: file.fieldname,
      filename: `${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname,
      path: `${file_type}/${file.filename}`,
      attachment_type: file_type,
    };

    await this.storageProvider.uploadFile(`${file.filename}`, `${file_type}`);

    const attach = this.attachmentsRepository.create(newAttachment);

    await this.attachmentsRepository.save(attach);

    return attach;
  }
}
