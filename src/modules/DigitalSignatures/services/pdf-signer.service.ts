import { Injectable, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DocumentSignature,
  SignatureStatus,
} from '../entities/document-signature.entity';
import { Certificate, CertificateStatus } from '../entities/certificate.entity';
import { CertificateService } from './certificate.service';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import {
  SignatureRequirement,
  SignatureRequirementStatus,
} from '@modules/Documents/entities/signatureRequirement.entity';
import {
  Document,
  DocumentStatus,
} from '@modules/Documents/entities/document.entity';
import { DocumentVersion } from '@modules/Documents/entities/documentVersion.entity';
import { PDFDocument } from 'pdf-lib';
import { ListRolesEnum } from '@modules/roles/interfaces/IListRoles';
import { SignPdfProvider } from '../providers/signpdf-provider';
import { GeneratePdfService } from '@modules/Documents/services/generate-pdf.service';

@Injectable()
export class PdfSignerService {
  private readonly logger = new Logger(PdfSignerService.name);

  constructor(
    @InjectRepository(DocumentSignature)
    private documentSignatureRepository: Repository<DocumentSignature>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @InjectRepository(SignatureRequirement)
    private signatureRequirementRepository: Repository<SignatureRequirement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DocumentVersion)
    private documentVersionRepository: Repository<DocumentVersion>,
    private certificateService: CertificateService,
    private signPdfProvider: SignPdfProvider,
    private s3Provider: S3Provider,
    private generatePdfService: GeneratePdfService,
  ) {}

  async signDocument(params: {
    documentId: string;
    userId: string;
    certificateId: string;
    password: string;
    signatureRequirementId?: string;
    reason?: string;
    signaturePosition?: {
      page: number;
      x: number;
      y: number;
    };
  }): Promise<DocumentSignature> {
    try {
      // 1. Início do processo de assinatura
      this.logger.debug('1. Iniciando processo de assinatura:', {
        documentId: params.documentId,
        userId: params.userId,
      });

      // 2. Buscar documento
      const document = await this.documentRepository.findOne({
        where: { id: params.documentId },
        relations: ['versions', 'signatures'],
      });

      if (!document) {
        this.logger.error(`2. Documento não encontrado: ${params.documentId}`);
        throw new HttpException('Document not found', 404);
      }

      this.logger.debug('2. Documento encontrado:', { id: document.id });

      // 3. Verificar se o documento está em um estado que permite assinatura
      this.logger.debug('3. Verificando status do documento:', {
        status: document.status,
      });
      if (
        document.status === DocumentStatus.ARCHIVED ||
        document.status === DocumentStatus.SIGNED
      ) {
        throw new HttpException(
          `Document status '${document.status}' does not allow signing`,
          400,
        );
      }

      // 4. Buscar e validar o certificado
      this.logger.debug('4. Buscando certificado:', {
        certificateId: params.certificateId,
        userId: params.userId,
      });

      const certificate = await this.certificateRepository.findOne({
        where: { id: params.certificateId, user_id: params.userId },
      });

      if (!certificate) {
        this.logger.error(
          '4. Certificado não encontrado ou não pertence ao usuário',
        );
        throw new HttpException(
          'Certificate not found or does not belong to user',
          404,
        );
      }

      // 5. Verificar se o certificado está ativo e válido
      this.logger.debug('5. Verificando validade do certificado');
      if (certificate.status !== CertificateStatus.ACTIVE) {
        throw new HttpException('Certificate is not active', 400);
      }

      const now = new Date();
      if (now < certificate.valid_from || now > certificate.valid_until) {
        throw new HttpException('Certificate is not valid at this time', 400);
      }

      // 6. Buscar requisito de assinatura, se especificado
      let signatureRequirement = null;
      this.logger.debug('6. Buscando requisito de assinatura:', {
        signatureRequirementId: params.signatureRequirementId,
      });

      if (params.signatureRequirementId) {
        signatureRequirement =
          await this.signatureRequirementRepository.findOne({
            where: {
              id: params.signatureRequirementId,
              document: { id: document.id },
              user_id: params.userId,
            },
          });

        if (!signatureRequirement) {
          this.logger.error(
            '6. Requisito de assinatura não encontrado ou não corresponde',
          );
          throw new HttpException(
            'Signature requirement not found or does not match document/user',
            404,
          );
        }
        this.logger.debug('6. Requisito de assinatura encontrado');
      }

      // 7. Importante: Atualizar status do requisito de assinatura ANTES de gerar o PDF
      // Assim o PDF será gerado com a representação visual da assinatura já completada
      if (signatureRequirement) {
        this.logger.debug(
          '7. Atualizando status do requisito de assinatura para SIGNED',
        );
        signatureRequirement.status = SignatureRequirementStatus.SIGNED;
        signatureRequirement.completed_at = new Date();
        await this.signatureRequirementRepository.save(signatureRequirement);
      }

      // 8. Buscar usuário para metadados de assinatura
      this.logger.debug('8. Buscando dados do usuário para assinatura');
      const user = await this.userRepository.findOne({
        where: { id: params.userId },
        relations: ['person_sig'],
      });

      this.logger.debug('9. Gerando PDF com visualização da assinatura');

      // 9. Gerar PDF com as assinaturas visuais já incluídas
      this.logger.debug('9. Gerando PDF com visualização da assinatura');
      const generatedPdfResult = await this.generatePdfService.execute(
        params.documentId,
        params.userId,
      );

      this.logger.debug('9. PDF gerado com sucesso:', {
        version: generatedPdfResult.version,
        s3_location: generatedPdfResult.download_url,
      });

      // 10. Baixar o PDF gerado para assinar digitalmente
      const s3Key = await this.documentVersionRepository
        .findOne({
          where: {
            document: { id: params.documentId },
            version: generatedPdfResult.version,
          },
        })
        .then((version) => version.s3_location);

      this.logger.debug('10. Obtendo o conteúdo do PDF gerado:', { s3Key });
      const pdfBuffer = await this.s3Provider.downloadContent(s3Key);

      // 11. Obter a chave privada descriptografada (usando a senha)
      this.logger.debug('11. Obtendo a chave privada descriptografada');
      const privateKey = await this.certificateService.getDecryptedPrivateKey(
        certificate.id,
        params.password,
      );

      // 12. Assinar o PDF digitalmente
      this.logger.debug('12. Assinando o PDF digitalmente');
      const signResult = await this.signPdfProvider.sign({
        pdfBuffer,
        certificate: certificate.certificate,
        password: params.password,
        privateKey,
        reason: params.reason || 'Document signature',
        location: 'SigSaúde Digital Signature Platform',
        contactInfo: user?.person_sig?.email || '',
      });

      if (signResult.status === 'INVALID') {
        this.logger.error(
          '12. Erro ao assinar o PDF digitalmente:',
          signResult.error,
        );
        throw new HttpException(
          `Error signing document: ${signResult.error}`,
          400,
        );
      }

      // 13. Salvar o PDF assinado no S3
      this.logger.debug(
        '13. Substituindo o PDF com a versão assinada digitalmente',
      );
      await this.s3Provider.uploadContent(signResult.signedPdfBuffer, s3Key, {
        contentType: 'application/pdf',
        metadata: {
          documentId: params.documentId,
          userId: params.userId,
          certificateId: params.certificateId,
          signedAt: new Date().toISOString(),
          version: generatedPdfResult.version.toString(),
          changeType: 'signature',
          signerName: user?.person_sig?.nome || params.userId,
        },
      });

      // 14. Atualizar o registro de versão para indicar que está assinado
      this.logger.debug('14. Atualizando metadados da versão do documento');
      await this.documentVersionRepository.update(
        {
          document: { id: params.documentId },
          version: generatedPdfResult.version,
        },
        {
          is_signed_version: true,
          change_reason: `Documento assinado por ${user?.person_sig?.nome || 'Usuário'}`,
        },
      );

      // 15. Criar registro da assinatura
      this.logger.debug('15. Criando registro de assinatura no sistema');
      const documentSignature = this.documentSignatureRepository.create({
        document_id: params.documentId,
        user_id: params.userId,
        certificate_id: params.certificateId,
        signature_requirement_id: signatureRequirement?.id || null,
        page: params.signaturePosition?.page || 0,
        position_x: params.signaturePosition?.x || 0,
        position_y: params.signaturePosition?.y || 0,
        reason: params.reason || 'Document signature',
        signature_data: signResult.signatureData,
        status: SignatureStatus.VALID,
        s3_location: s3Key,
        signed_at: new Date(),
      });

      const savedSignature = await this.documentSignatureRepository.save({
        ...documentSignature,
        document: { id: params.documentId },
      });

      // 16. Verificar se todas as assinaturas necessárias foram feitas
      this.logger.debug(
        '16. Verificando se todas as assinaturas foram concluídas',
      );
      if (document.signatures && document.signatures.length > 0) {
        const pendingSignatures =
          await this.signatureRequirementRepository.count({
            where: {
              document: { id: document.id },
              status: SignatureRequirementStatus.PENDING,
            },
          });

        this.logger.debug('16. Assinaturas pendentes:', { pendingSignatures });
        if (pendingSignatures === 0) {
          this.logger.debug(
            '16. Todas as assinaturas concluídas, atualizando status do documento para SIGNED',
          );
          await this.documentRepository.update(document.id, {
            status: DocumentStatus.SIGNED,
            next_action: 'Complete',
          });
        }
      }

      // 17. Finalizar o processo
      this.logger.debug('17. Processo de assinatura concluído com sucesso');
      return savedSignature;
    } catch (error) {
      this.logger.error(
        `Erro ao assinar documento: ${error.message}`,
        error.stack,
      );
      throw new HttpException(`Error signing document: ${error.message}`, 400);
    }
  }

  async verifyDocumentSignatures(documentId: string): Promise<{
    isValid: boolean;
    signatures: Array<{
      id: string;
      signer: string;
      signedAt: Date;
      isValid: boolean;
      reason?: string;
    }>;
  }> {
    try {
      // Buscar documento
      const document = await this.documentRepository.findOne({
        where: { id: documentId },
      });

      if (!document) {
        throw new HttpException('Document not found', 404);
      }

      // Buscar assinaturas do documento
      const documentSignatures = await this.documentSignatureRepository.find({
        where: { document_id: documentId },
        relations: ['user', 'user.person_sig', 'certificate'],
        order: { signed_at: 'ASC' },
      });

      if (documentSignatures.length === 0) {
        return {
          isValid: false,
          signatures: [],
        };
      }

      // Obter o PDF mais recente assinado
      const lastSignature = documentSignatures[documentSignatures.length - 1];
      const pdfBuffer = await this.s3Provider.downloadContent(
        lastSignature.s3_location,
      );

      // Verificar as assinaturas no PDF
      const verifyResult = await this.signPdfProvider.verify(pdfBuffer);

      // Mapear as assinaturas
      const signatures = documentSignatures.map((signature) => ({
        id: signature.id,
        signer: signature.user?.person_sig?.nome || 'Unknown',
        signedAt: signature.signed_at,
        isValid: signature.status === SignatureStatus.VALID,
        reason: signature.reason,
      }));

      return {
        isValid: verifyResult.isValid,
        signatures,
      };
    } catch (error) {
      this.logger.error(
        `Error verifying document signatures: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error verifying document signatures: ${error.message}`,
        400,
      );
    }
  }

  async getDocumentSignatures(
    documentId: string,
  ): Promise<DocumentSignature[]> {
    return this.documentSignatureRepository.find({
      where: { document_id: documentId },
      relations: ['user', 'user.person_sig', 'certificate'],
      order: { signed_at: 'ASC' },
    });
  }

  async getSignatureById(id: string): Promise<DocumentSignature> {
    const signature = await this.documentSignatureRepository.findOne({
      where: { id },
      relations: ['user', 'user.person_sig', 'certificate', 'document'],
    });

    if (!signature) {
      throw new HttpException('Signature not found', 404);
    }

    return signature;
  }

  async getSignedDocumentUrl(signatureId: string): Promise<string> {
    const signature = await this.getSignatureById(signatureId);

    if (!signature.s3_location) {
      throw new HttpException('Signed document not found', 404);
    }

    return this.s3Provider.getSignedUrl(signature.s3_location, 3600);
  }

  async validateUploadedDocument(pdfBuffer: Buffer): Promise<{
    isValid: boolean;
    signatures: Array<{
      signer: string;
      signedAt: Date;
      isValid: boolean;
      reason?: string;
    }>;
  }> {
    try {
      // Converter o buffer em formato PDF utilizável
      const buffer = pdfBuffer;

      // Verificar se o buffer é válido e contém um PDF
      if (!buffer || buffer.length === 0) {
        throw new Error('Invalid PDF buffer');
      }

      // Tentar ler como PDF para validar que é um documento válido antes de verificar assinatura
      await PDFDocument.load(buffer);

      // Verificar as assinaturas usando o provider
      const verifyResult = await this.signPdfProvider.verify(buffer);

      // Adicione mais informações de debug para ajudar na depuração
      this.logger.debug('Validation result:', verifyResult);

      return {
        isValid: verifyResult.isValid,
        signatures: verifyResult.signatures || [],
      };
    } catch (error) {
      this.logger.error(
        `Error validating document: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error validating document: ${error.message}`,
        400,
      );
    }
  }

  // Adicione este método ao PdfSignerService
  async isDocumentSigned(documentId: string): Promise<boolean> {
    try {
      // Contar quantas assinaturas o documento possui
      const signatures = await this.documentSignatureRepository.count({
        where: { document_id: documentId },
      });

      return signatures > 0;
    } catch (error) {
      this.logger.error(
        `Error checking if document is signed: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  // Use este método para buscar detalhes mais completos de assinatura
  async getDocumentSignatureDetails(documentId: string): Promise<{
    isSigned: boolean;
    signatures: Array<{
      id: string;
      signer: {
        id: string;
        name: string;
      };
      role: string;
      signedAt: Date;
      position?: {
        page: number;
        x: number;
        y: number;
      };
    }>;
  }> {
    try {
      const signatures = await this.documentSignatureRepository.find({
        where: { document_id: documentId },
        relations: ['user', 'user.person_sig'],
        order: { signed_at: 'ASC' },
      });

      return {
        isSigned: signatures.length > 0,
        signatures: signatures.map((sig) => ({
          id: sig.id,
          signer: {
            id: sig.user_id,
            name: sig.user?.person_sig?.nome || 'Unknown',
          },
          role: sig.user.roles
            .map((role) => role.name)
            .includes(ListRolesEnum.professional)
            ? ListRolesEnum.professional
            : ListRolesEnum.patient,
          signedAt: sig.signed_at,
          position:
            sig.page !== null
              ? {
                  page: sig.page,
                  x: sig.position_x,
                  y: sig.position_y,
                }
              : undefined,
        })),
      };
    } catch (error) {
      this.logger.error(
        `Error getting document signature details: ${error.message}`,
        error.stack,
      );
      return {
        isSigned: false,
        signatures: [],
      };
    }
  }

  async getDocumentVersions(documentId: string): Promise<any[]> {
    try {
      const versions = await this.documentVersionRepository.find({
        where: {
          document: {
            id: documentId,
          },
        },
        order: { version: 'DESC' },
      });

      return versions;
    } catch (error) {
      this.logger.error(
        `Error getting document versions: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error getting document versions: ${error.message}`,
        400,
      );
    }
  }

  async getVersionDownloadUrl(versionId: string): Promise<string> {
    try {
      const version = await this.documentVersionRepository.findOne({
        where: { id: versionId },
      });

      if (!version) {
        throw new HttpException('Document version not found', 404);
      }

      return this.s3Provider.getSignedUrl(version.s3_location, 3600); // URL válida por 1 hora
    } catch (error) {
      this.logger.error(
        `Error getting version download URL: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error getting version download URL: ${error.message}`,
        400,
      );
    }
  }

  // Método para criar uma nova versão ao editar um documento
  async createNewVersion(params: {
    documentId: string;
    pdfBuffer: Buffer;
    userId: string;
    changeReason: string;
  }): Promise<any> {
    try {
      const document = await this.documentRepository.findOne({
        where: { id: params.documentId },
        relations: ['versions'],
      });

      if (!document) {
        throw new HttpException('Document not found', 404);
      }

      // Encontrar a versão mais recente
      const latestVersion = document.versions.reduce(
        (latest, current) =>
          current.version > latest.version ? current : latest,
        document.versions[0],
      );

      const newVersionNumber = latestVersion ? latestVersion.version + 1 : 1;

      // Salvar o novo PDF no S3
      const pdfKey = `documents/${document.id}/pdf/v${newVersionNumber}_${Date.now()}.pdf`;

      await this.s3Provider.uploadContent(params.pdfBuffer, pdfKey, {
        contentType: 'application/pdf',
        metadata: {
          documentId: document.id,
          userId: params.userId,
          version: newVersionNumber.toString(),
          changeReason: params.changeReason,
        },
      });

      // Criar registro da nova versão
      const documentVersion = this.documentVersionRepository.create({
        document: { id: document.id },
        version: newVersionNumber,
        s3_location: pdfKey,
        mime_type: 'application/pdf',
        change_reason: params.changeReason,
        created_by: params.userId,
      });

      return await this.documentVersionRepository.save(documentVersion);
    } catch (error) {
      this.logger.error(
        `Error creating new version: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error creating new version: ${error.message}`,
        400,
      );
    }
  }

  // Métodos para uso direto do SignPdfProvider (para o módulo de atendimentos)
  async signPdfDirect(params: {
    pdfBuffer: Buffer;
    certificate: string;
    password: string;
    privateKey: string;
    reason?: string;
    location?: string;
    contactInfo?: string;
  }) {
    return this.signPdfProvider.sign(params);
  }

  async verifyPdfDirect(pdfBuffer: Buffer) {
    return this.signPdfProvider.verify(pdfBuffer);
  }
}
