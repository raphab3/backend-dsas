import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Document,
  DocumentStatus,
  DocumentType,
} from '../entities/document.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { DocumentVersion } from '../entities/documentVersion.entity';

interface UploadMetadata {
  name?: string;
  description?: string;
  header_template_id?: string;
  footer_template_id?: string;
  created_by: string;
}

@Injectable()
export class UploadDocumentService {
  private readonly logger = new Logger(UploadDocumentService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(DocumentVersion)
    private documentVersionRepository: Repository<DocumentVersion>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private s3Provider: S3Provider,
  ) {}

  async execute(file: any, metadata: UploadMetadata): Promise<Document> {
    this.logger.log(`Iniciando upload de documento: ${file.originalname}`);

    if (!metadata.created_by) {
      throw new HttpException('Usuário não informado', 400);
    }

    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: metadata.created_by },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    // Iniciar transação
    const queryRunner =
      this.documentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Fazer upload do arquivo para o S3
      const s3Key = `documents/uploads/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      await this.s3Provider.uploadContent(file.buffer, s3Key, {
        contentType: file.mimetype,
        contentDisposition: `attachment; filename="${file.originalname}"`,
        metadata: {
          originalName: file.originalname,
          size: String(file.size),
          uploadedBy: metadata.created_by,
        },
      });

      // Criar o documento
      const document = this.documentRepository.create({
        name: metadata.name || file.originalname,
        description: metadata.description,
        type: DocumentType.UPLOADED,
        status: DocumentStatus.DRAFT,
        next_action: 'Editar',
        header_template_id: metadata.header_template_id,
        footer_template_id: metadata.footer_template_id,
        created_by: metadata.created_by,
      });

      // Salvar o documento
      const savedDocument = await queryRunner.manager.save(document);

      // Criar versão do documento
      const documentVersion = this.documentVersionRepository.create({
        document: { id: savedDocument.id },
        version: 1,
        s3_location: s3Key,
        mime_type: file.mimetype,
        change_reason: 'Upload inicial',
        created_by: metadata.created_by,
      });

      // Salvar versão do documento
      await queryRunner.manager.save(documentVersion);

      // Confirmar transação
      await queryRunner.commitTransaction();

      this.logger.log(`Documento enviado com sucesso: ${savedDocument.id}`);

      return {
        ...savedDocument,
        versions: [documentVersion],
      };
    } catch (error) {
      // Reverter transação em caso de erro
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Erro ao fazer upload de documento: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Erro ao fazer upload de documento: ${error.message}`,
        400,
      );
    } finally {
      // Liberar queryRunner
      await queryRunner.release();
    }
  }
}
