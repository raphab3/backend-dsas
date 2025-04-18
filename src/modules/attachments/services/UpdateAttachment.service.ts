import { ICreateAttachment } from '../interfaces/CreateAttachment';
import IAttachment from '../interfaces/IAttachment';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Attachment from '../entities/Attachment';
import { Repository } from 'typeorm';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

interface IRequest {
  id?: string;
  file: ICreateAttachment;
}

@Injectable()
export default class UpdateAttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
    private storageProvider: S3Provider,
  ) {}

  public async execute({ id, file }: IRequest): Promise<IAttachment | null> {
    if (!file) {
      throw new HttpException('File not found', 400);
    }

    if (id) {
      const attachmentFound = await this.attachmentsRepository.findOne({
        where: { id },
      });

      if (!attachmentFound) {
        throw new HttpException('Attachment not found', 404);
      }

      const oldFilePath = `${attachmentFound.attachment_type}/${attachmentFound.filename}`;
      file.path = `${file.attachment_type}/${file.filename}`;

      // const result = await this.attachmentsRepository.update(id, file);
      const result = await this.attachmentsRepository
        .createQueryBuilder()
        .update(Attachment)
        .set(file)
        .where('id = :id', { id })
        .returning('*')
        .execute();

      if (result) {
        await this.storageProvider.uploadFile(
          `${file.filename}`,
          `${file.attachment_type}`,
        );
        await this.storageProvider.deleteObject(oldFilePath);
        result.raw[0].file_url = await this.getPresignedUrl(file.path);

        return result.raw[0];
      }
    } else {
      file.path = `${file.attachment_type}/${file.filename}`;
      const newAttachment = this.attachmentsRepository.create(file);
      await this.attachmentsRepository.save(newAttachment);
      await this.storageProvider.uploadFile(
        `${file.filename}`,
        `${file.attachment_type}`,
      );
      newAttachment.file_url = await this.getPresignedUrl(
        `${newAttachment.path}`,
      );

      return newAttachment;
    }

    return null;
  }

  private async getPresignedUrl(path: string): Promise<string> {
    return this.storageProvider.getSignedUrl(path, 12 * 60 * 60);
  }
}
