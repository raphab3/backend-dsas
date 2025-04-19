import { Injectable, Logger, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import {
  AttendanceSignature,
  AttendanceSignatureStatus,
} from '../entities/attendanceSignature.entity';
import { AttendancePdfService } from './attendance-pdf.service';
import { PdfSignerService } from '@modules/DigitalSignatures/services/pdf-signer.service';
import { CertificateService } from '@modules/DigitalSignatures/services/certificate.service';
import {
  Certificate,
  CertificateStatus,
} from '@modules/DigitalSignatures/entities/certificate.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { User } from '@modules/users/typeorm/entities/user.entity';

@Injectable()
export class AttendanceSignatureService {
  private readonly logger = new Logger(AttendanceSignatureService.name);

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(AttendanceSignature)
    private attendanceSignatureRepository: Repository<AttendanceSignature>,
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private attendancePdfService: AttendancePdfService,
    private certificateService: CertificateService,
    private pdfSignerService: PdfSignerService,
    private s3Provider: S3Provider,
  ) {}

  /**
   * Signs an attendance PDF
   */
  async signAttendancePdf(params: {
    attendanceId: string;
    userId: string;
    certificateId?: string;
    password: string;
    includeEvolution?: boolean;
    reason?: string;
    signaturePosition?: {
      page?: number;
      x?: number;
      y?: number;
    };
  }): Promise<{
    signature: AttendanceSignature;
    signedDocumentUrl: string;
  }> {
    try {
      this.logger.debug('1. Iniciando processo de assinatura de atendimento:', {
        attendanceId: params.attendanceId,
        userId: params.userId,
      });

      // 1. Verificar se o atendimento existe
      const attendance = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .where('attendance.id = :id', { id: params.attendanceId })
        .getOne();

      if (!attendance) {
        throw new HttpException('Atendimento não encontrado', 404);
      }

      // 2. Se não foi fornecido um certificado, buscar o certificado padrão do usuário
      let certificateId = params.certificateId;
      if (!certificateId) {
        const userCertificates =
          await this.certificateService.getUserCertificates(params.userId);
        const defaultCertificate = userCertificates.find(
          (cert) => cert.is_default && cert.status === CertificateStatus.ACTIVE,
        );

        if (!defaultCertificate) {
          throw new HttpException('Nenhum certificado padrão encontrado', 404);
        }

        certificateId = defaultCertificate.id;
      }

      // 3. Buscar o certificado
      const certificate = await this.certificateRepository.findOne({
        where: { id: certificateId },
      });

      if (!certificate) {
        throw new HttpException('Certificado não encontrado', 404);
      }

      if (certificate.status !== CertificateStatus.ACTIVE) {
        throw new HttpException('Certificado não está ativo', 400);
      }

      // 4. Buscar o usuário
      const user = await this.userRepository.findOne({
        where: { id: params.userId },
        relations: ['person_sig'],
      });

      if (!user) {
        throw new HttpException('Usuário não encontrado', 404);
      }

      // 5. Gerar o PDF do atendimento
      this.logger.debug('5. Gerando PDF do atendimento');
      const { s3Key, pdfBuffer, verificationCode } =
        await this.attendancePdfService.generatePdf(params.attendanceId, {
          includeEvolution: params.includeEvolution,
          userId: params.userId,
        });

      this.logger.debug(
        `5. PDF gerado: s3Key=${s3Key}, pdfBuffer type=${typeof pdfBuffer}, isBuffer=${Buffer.isBuffer(pdfBuffer)}, length=${pdfBuffer?.length || 'N/A'}`,
      );

      // Baixar o PDF do S3 para garantir que temos um buffer válido
      this.logger.debug(
        '5.1 Baixando o PDF do S3 para garantir que temos um buffer válido',
      );
      const downloadedPdfBuffer = await this.s3Provider.downloadContent(s3Key);
      this.logger.debug(
        `5.1 PDF baixado: type=${typeof downloadedPdfBuffer}, isBuffer=${Buffer.isBuffer(downloadedPdfBuffer)}, length=${downloadedPdfBuffer?.length || 'N/A'}`,
      );

      // Usar o buffer baixado do S3 em vez do buffer original
      const pdfBufferToUse = downloadedPdfBuffer;

      // 6. Obter a chave privada descriptografada (usando a senha)
      this.logger.debug('6. Obtendo a chave privada descriptografada');
      const privateKey = await this.certificateService.getDecryptedPrivateKey(
        certificate.id,
        params.password,
      );

      // 7. Assinar o PDF digitalmente
      this.logger.debug('7. Assinando o PDF digitalmente');

      // Verificar se pdfBufferToUse é um Buffer válido
      if (!Buffer.isBuffer(pdfBufferToUse)) {
        this.logger.error('7. pdfBufferToUse não é um Buffer válido');
        throw new HttpException('PDF buffer is not valid', 400);
      }

      this.logger.debug(`7. PDF buffer size: ${pdfBufferToUse.length} bytes`);

      // Usar o SignPdfProvider através do PdfSignerService
      const signResult = await this.pdfSignerService.signPdfDirect({
        pdfBuffer: pdfBufferToUse,
        certificate: certificate.certificate,
        password: params.password,
        privateKey,
        reason: params.reason || 'Assinatura de Atendimento Médico',
        location: 'Plataforma de Assinatura Digital SigSaúde',
        contactInfo: user?.person_sig?.email || '',
      });

      if (signResult.status === 'INVALID') {
        this.logger.error(
          '7. Erro ao assinar o PDF digitalmente:',
          signResult.error,
        );
        throw new HttpException(
          `Error signing document: ${signResult.error}`,
          400,
        );
      }

      // 8. Salvar o PDF assinado no S3
      this.logger.debug(
        '8. Substituindo o PDF com a versão assinada digitalmente',
      );
      await this.s3Provider.uploadContent(signResult.signedPdfBuffer, s3Key, {
        contentType: 'application/pdf',
        contentDisposition: 'inline',
        metadata: {
          attendanceId: params.attendanceId,
          userId: params.userId,
          certificateId: certificateId,
          signedAt: new Date().toISOString(),
          changeType: 'signature',
          signerName: user?.person_sig?.nome || params.userId,
        },
      });

      // 9. Criar registro da assinatura
      this.logger.debug('9. Criando registro de assinatura no sistema');
      const attendanceSignature = this.attendanceSignatureRepository.create({
        attendance_id: params.attendanceId,
        user_id: params.userId,
        certificate_id: certificateId,
        page: params.signaturePosition?.page || 0,
        position_x: params.signaturePosition?.x || 0,
        position_y: params.signaturePosition?.y || 0,
        reason: params.reason || 'Attendance signature',
        signature_data: signResult.signatureData,
        status: AttendanceSignatureStatus.VALID,
        s3_location: s3Key,
        verification_code: verificationCode,
        signed_at: new Date(),
      });

      const savedSignature =
        await this.attendanceSignatureRepository.save(attendanceSignature);

      // 10. Gerar URL de download
      const signedDocumentUrl = await this.s3Provider.getSignedUrl(s3Key, 3600);

      return {
        signature: savedSignature,
        signedDocumentUrl,
      };
    } catch (error) {
      this.logger.error(
        `Error signing attendance PDF: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error signing attendance PDF: ${error.message}`,
        error.status || 500,
      );
    }
  }

  /**
   * Gets all signatures for an attendance
   */
  async getAttendanceSignatures(
    attendanceId: string,
  ): Promise<AttendanceSignature[]> {
    return this.attendanceSignatureRepository.find({
      where: { attendance_id: attendanceId },
      relations: ['user', 'user.person_sig', 'certificate'],
      order: { signed_at: 'DESC' },
    });
  }

  /**
   * Gets a signature by ID
   */
  async getSignatureById(signatureId: string): Promise<AttendanceSignature> {
    const signature = await this.attendanceSignatureRepository.findOne({
      where: { id: signatureId },
      relations: ['user', 'user.person_sig', 'certificate'],
    });

    if (!signature) {
      throw new HttpException('Signature not found', 404);
    }

    return signature;
  }

  /**
   * Gets a signed URL for a signature
   */
  async getSignedDocumentUrl(signatureId: string): Promise<string> {
    const signature = await this.getSignatureById(signatureId);

    if (!signature.s3_location) {
      throw new HttpException('Signed document not found', 404);
    }

    return this.s3Provider.getSignedUrl(signature.s3_location, 3600);
  }

  /**
   * Verifies a signed PDF
   */
  async verifySignedPdf(attendanceId: string): Promise<{
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
      // Get all signatures for the attendance
      const signatures = await this.getAttendanceSignatures(attendanceId);

      if (signatures.length === 0) {
        return {
          isValid: false,
          signatures: [],
        };
      }

      // Get the most recent signature
      const lastSignature = signatures[0];

      // Download the signed PDF
      const pdfBuffer = await this.s3Provider.downloadContent(
        lastSignature.s3_location,
      );

      // Verify the signatures in the PDF
      // Verificar se pdfBuffer é um Buffer válido
      if (!Buffer.isBuffer(pdfBuffer)) {
        this.logger.error('pdfBuffer não é um Buffer válido');
        throw new HttpException('PDF buffer is not valid', 400);
      }

      this.logger.debug(`PDF buffer size: ${pdfBuffer.length} bytes`);

      // Verificar as assinaturas no PDF
      const verifyResult = await this.pdfSignerService.verifyPdfDirect(
        Buffer.from(pdfBuffer),
      );

      // Map the signatures
      const mappedSignatures = signatures.map((signature) => ({
        id: signature.id,
        signer: signature.user?.person_sig?.nome || 'Unknown',
        signedAt: signature.signed_at,
        isValid: signature.status === AttendanceSignatureStatus.VALID,
        reason: signature.reason,
      }));

      return {
        isValid: verifyResult.isValid,
        signatures: mappedSignatures,
      };
    } catch (error) {
      this.logger.error(
        `Error verifying attendance signatures: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error verifying attendance signatures: ${error.message}`,
        500,
      );
    }
  }

  /**
   * Deletes a signature
   */
  async deleteSignature(signatureId: string, userId: string): Promise<void> {
    try {
      this.logger.debug(`Deleting signature ${signatureId} by user ${userId}`);

      // Buscar a assinatura
      const signature = await this.attendanceSignatureRepository.findOne({
        where: { id: signatureId },
        relations: ['user'],
      });

      if (!signature) {
        throw new HttpException('Signature not found', 404);
      }

      // Verificar se o usuário tem permissão para deletar a assinatura
      // Apenas o usuário que criou a assinatura pode deletá-la
      if (signature.user_id !== userId) {
        throw new HttpException(
          'You are not authorized to delete this signature',
          403,
        );
      }

      // Deletar a assinatura
      await this.attendanceSignatureRepository.remove(signature);

      this.logger.debug(`Signature ${signatureId} deleted successfully`);
    } catch (error) {
      this.logger.error(
        `Error deleting signature: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error deleting signature: ${error.message}`,
        error.status || 500,
      );
    }
  }
}
