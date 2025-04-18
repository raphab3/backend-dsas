import Attachment from '../entities/Attachment';
import IAttachment from '../interfaces/IAttachment';
import { CreateAttachmentDto } from '../dtos/CreateAttachmentDto';
import { ICreateAttachment } from '../interfaces/CreateAttachment';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

@Injectable()
export default class CreateAttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
    private storageProvider: S3Provider,
  ) {}

  public async execute(data: CreateAttachmentDto): Promise<IAttachment> {
    const { file } = data;
    if (!file) {
      throw new HttpException('Arquivo não encontrado', 400);
    }

    if (!Object.keys(file).length) {
      throw new HttpException('Arquivo não encontrado', 400);
    }

    const newAttachment: ICreateAttachment = {
      fieldname: file.fieldname,
      filename: `${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname,
      path: `${data.attachment_type}/${file.filename}`,
      attachment_type: data.attachment_type,
    };

    await this.storageProvider.uploadFile(
      `${file.filename}`,
      `${data.attachment_type}`,
    );

    const attach = this.attachmentsRepository.create(newAttachment);

    await this.attachmentsRepository.save(attach);

    return attach;
  }
}
