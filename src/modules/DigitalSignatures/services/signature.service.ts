import { Injectable, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentSignature } from '../entities/document-signature.entity';
import { CertificateService } from './certificate.service';
import { PdfSignerService } from './pdf-signer.service';
import {
  SignatureRequirement,
  SignatureRequirementStatus,
} from '@modules/Documents/entities/signatureRequirement.entity';
import { Document } from '@modules/Documents/entities/document.entity';
import { CertificateStatus } from '../entities/certificate.entity';

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(SignatureService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(SignatureRequirement)
    private signatureRequirementRepository: Repository<SignatureRequirement>,
    private certificateService: CertificateService,
    private pdfSignerService: PdfSignerService,
  ) {}

  async signDocument(params: {
    documentId: string;
    userId: string;
    certificateId?: string;
    password: string;
    signatureRequirementId?: string;
    reason?: string;
    signaturePosition?: {
      page: number;
      x: number;
      y: number;
    };
  }): Promise<{
    signature: DocumentSignature;
    signedDocumentUrl: string;
    allSignaturesCompleted: boolean;
  }> {
    try {
      // Verificar se o documento existe
      const document = await this.documentRepository
        .createQueryBuilder('document')
        .where('document.id = :id', { id: params.documentId })
        .getOne();

      if (!document) {
        throw new HttpException('Document not found', 404);
      }

      // Se não foi fornecido um certificado, buscar o certificado padrão do usuário
      let certificateId = params.certificateId;
      if (!certificateId) {
        const userCertificates =
          await this.certificateService.getUserCertificates(params.userId);
        const defaultCertificate = userCertificates.find(
          (cert) => cert.is_default && cert.status === CertificateStatus.ACTIVE,
        );

        if (!defaultCertificate) {
          throw new HttpException('No default certificate found for user', 404);
        }

        certificateId = defaultCertificate.id;
      }

      let signatureRequirementId = params.signatureRequirementId;
      if (!signatureRequirementId) {
        const pendingRequirement =
          await this.signatureRequirementRepository.findOne({
            where: {
              document_id: params.documentId,
              user_id: params.userId,
              status: SignatureRequirementStatus.PENDING,
            },
          });

        if (pendingRequirement) {
          signatureRequirementId = pendingRequirement.id;
        }
      }

      // Assinar o documento
      const signature = await this.pdfSignerService.signDocument({
        documentId: params.documentId,
        userId: params.userId,
        certificateId,
        password: params.password,
        signatureRequirementId,
        reason: params.reason,
        signaturePosition: params.signaturePosition,
      });

      // Obter URL do documento assinado
      const signedDocumentUrl =
        await this.pdfSignerService.getSignedDocumentUrl(signature.id);

      // Verificar se todas as assinaturas foram concluídas
      const pendingSignatures = await this.signatureRequirementRepository.count(
        {
          where: {
            document_id: params.documentId,
            status: SignatureRequirementStatus.PENDING,
          },
        },
      );

      return {
        signature,
        signedDocumentUrl,
        allSignaturesCompleted: pendingSignatures === 0,
      };
    } catch (error) {
      this.logger.error(
        `Error signing document: ${error.message}`,
        error.stack,
      );
      throw new HttpException(`Error signing document: ${error.message}`, 400);
    }
  }

  async getPendingSignatures(userId: string): Promise<
    {
      documentId: string;
      documentName: string;
      requirementId: string;
      requestedAt: Date;
    }[]
  > {
    try {
      const pendingRequirements =
        await this.signatureRequirementRepository.find({
          where: {
            user_id: userId,
            status: SignatureRequirementStatus.PENDING,
          },
          relations: ['document'],
        });

      return pendingRequirements.map((req) => ({
        documentId: req.document_id,
        documentName: req.document?.name || 'Unknown Document',
        requirementId: req.id,
        requestedAt: req.created_at,
      }));
    } catch (error) {
      this.logger.error(
        `Error getting pending signatures: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error getting pending signatures: ${error.message}`,
        400,
      );
    }
  }

  async getSignedDocuments(userId: string): Promise<
    {
      documentId: string;
      documentName: string;
      signatureId: string;
      signedAt: Date;
    }[]
  > {
    try {
      const documentSignatures =
        await this.pdfSignerService.getDocumentSignatures(userId);

      return documentSignatures.map((sig) => ({
        documentId: sig.document_id,
        documentName: sig.document?.name || 'Unknown Document',
        signatureId: sig.id,
        signedAt: sig.signed_at,
      }));
    } catch (error) {
      this.logger.error(
        `Error getting signed documents: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error getting signed documents: ${error.message}`,
        400,
      );
    }
  }
}
