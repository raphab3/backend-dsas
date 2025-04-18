import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../entities/document.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { DocumentVersion } from '../entities/documentVersion.entity';
import { SignatureRequirement } from '../entities/signatureRequirement.entity';

@Injectable()
export class DeleteDocumentService {
  private readonly logger = new Logger(DeleteDocumentService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(DocumentVersion)
    private documentVersionRepository: Repository<DocumentVersion>,
    @InjectRepository(SignatureRequirement)
    private signatureRequirementRepository: Repository<SignatureRequirement>,
    private s3Provider: S3Provider,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Deletando documento com ID: ${id}`);

    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['versions', 'signatures'],
    });

    if (!document) {
      this.logger.warn(`Documento com ID ${id} não encontrado`);
      throw new HttpException('Documento não encontrado', 404);
    }

    // Verificar se o documento pode ser deletado
    if (
      document.status === DocumentStatus.SIGNED ||
      document.status === DocumentStatus.ARCHIVED
    ) {
      this.logger.warn(
        `Documento com ID ${id} não pode ser deletado (status: ${document.status})`,
      );
      throw new HttpException(
        'Documentos assinados ou arquivados não podem ser deletados',
        400,
      );
    }

    // Iniciar transação
    const queryRunner =
      this.documentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Deletar requisitos de assinaturas
      if (document.signatures && document.signatures.length > 0) {
        await this.signatureRequirementRepository.remove(document.signatures);
      }

      // Deletar versões do documento e seus arquivos no S3
      if (document.versions && document.versions.length > 0) {
        // Deletar arquivos no S3
        for (const version of document.versions) {
          try {
            await this.s3Provider.deleteObject(version.s3_location);
          } catch (s3Error) {
            this.logger.warn(`Erro ao deletar arquivo S3: ${s3Error.message}`);
            // Continuar mesmo se houver erro ao deletar do S3
          }
        }

        // Deletar versões no banco de dados
        await this.documentVersionRepository.remove(document.versions);
      }

      // Deletar o documento
      await this.documentRepository.remove(document);

      // Confirmar transação
      await queryRunner.commitTransaction();
      this.logger.log(`Documento ${id} deletado com sucesso`);
    } catch (error) {
      // Reverter transação em caso de erro
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Erro ao deletar documento: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Erro ao deletar documento: ${error.message}`,
        400,
      );
    } finally {
      // Liberar queryRunner
      await queryRunner.release();
    }
  }
}
