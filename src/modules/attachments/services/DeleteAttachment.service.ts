import Attachment from '../entities/Attachment';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';

@Injectable()
export default class DeleteAttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,
    private storageProvider: S3Provider,
  ) {}

  public async execute(id: string): Promise<void> {
    const attachment = await this.attachmentsRepository.findOne({
      where: { id },
    });

    if (!attachment) {
      throw new HttpException('Anexo não encontrado', 404);
    }

    attachment.deleted_at = new Date();
    await this.attachmentsRepository.save(attachment);

    try {
      await this.storageProvider.deleteObject(attachment.path);
    } catch (error) {
      throw new HttpException(
        `Falha ao deletar o arquivo no storage: ${error.message}`,
        500,
      );
    }

    await this.attachmentsRepository.remove(attachment);
  }
}
