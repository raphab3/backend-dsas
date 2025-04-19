import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdfSignerService } from '../../DigitalSignatures/services/pdf-signer.service';
import { Document } from '../entities/document.entity';
import { Attendance } from '../../attendances/entities/attendance.entity';
import {
  AttendanceSignature,
  AttendanceSignatureStatus,
} from '../../attendances/entities/attendanceSignature.entity';
import { AttendanceSignatureService } from '../../attendances/services/attendance-signature.service';

@Injectable()
export class DocumentVerificationService {
  private readonly logger = new Logger(DocumentVerificationService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(AttendanceSignature)
    private readonly attendanceSignatureRepository: Repository<AttendanceSignature>,
    private readonly pdfSignerService: PdfSignerService,
    private readonly attendanceSignatureService: AttendanceSignatureService,
  ) {}

  /**
   * Encontra um documento pelo código de verificação
   * @param verificationCode Código de verificação do documento
   * @returns O documento encontrado ou null
   */
  async findByVerificationCode(
    verificationCode: string,
  ): Promise<Document | null> {
    this.logger.debug(
      `Buscando documento com código de verificação: ${verificationCode}`,
    );

    return this.documentRepository.findOne({
      where: { verification_code: verificationCode },
    });
  }

  /**
   * Encontra uma assinatura de atendimento pelo código de verificação
   * @param verificationCode Código de verificação da assinatura
   * @returns A assinatura encontrada ou null
   */
  async findAttendanceSignatureByVerificationCode(
    verificationCode: string,
  ): Promise<AttendanceSignature | null> {
    this.logger.debug(
      `Buscando assinatura de atendimento com código de verificação: ${verificationCode}`,
    );

    return this.attendanceSignatureRepository.findOne({
      where: { verification_code: verificationCode },
      relations: ['attendance'],
    });
  }

  /**
   * Encontra um atendimento pelo código
   * @param code Código do atendimento (formato: ATD + timestamp)
   * @returns O atendimento encontrado ou null
   */
  async findAttendanceByCode(code: string): Promise<Attendance | null> {
    this.logger.debug(`Buscando atendimento com código: ${code}`);

    return this.attendanceRepository.findOne({
      where: { code },
      relations: [
        'patient',
        'professional',
        'professional.person_sig',
        'specialty',
        'location',
      ],
    });
  }

  /**
   * Obtém detalhes completos de um documento
   * @param documentId ID do documento
   * @returns Detalhes do documento
   */
  async getDocumentDetails(documentId: string) {
    this.logger.debug(`Obtendo detalhes do documento: ${documentId}`);

    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['documentType', 'createdBy'],
    });

    if (!document) {
      throw new NotFoundException(
        `Documento com ID ${documentId} não encontrado`,
      );
    }

    // Usando any para contornar problemas de tipagem com a entidade Document
    const doc = document as any;

    return {
      id: doc.id,
      type: doc.documentType?.name || 'Documento',
      title: doc.title,
      createdAt: doc.createdAt,
      createdBy: doc.createdBy
        ? {
            id: doc.createdBy.id,
            name: doc.createdBy.name,
          }
        : null,
      verificationCode: doc.verification_code,
    };
  }

  /**
   * Obtém detalhes completos de um atendimento
   * @param attendanceId ID do atendimento
   * @returns Detalhes do atendimento
   */
  async getAttendanceDetails(attendanceId: string) {
    this.logger.debug(`Obtendo detalhes do atendimento: ${attendanceId}`);

    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
      relations: [
        'patient',
        'professional',
        'professional.person_sig',
        'specialty',
        'location',
      ],
    });

    if (!attendance) {
      throw new NotFoundException(
        `Atendimento com ID ${attendanceId} não encontrado`,
      );
    }

    // Usando any para contornar problemas de tipagem
    const patient = attendance.patient as any;

    return {
      id: attendance.id,
      code: attendance.code,
      type: 'Atendimento Médico',
      title: `Atendimento ${attendance.code}`,
      createdAt: attendance.createdAt,
      patient: patient
        ? {
            id: patient.id,
            name: patient.name,
          }
        : null,
      professional: attendance.professional?.person_sig
        ? {
            id: attendance.professional.id,
            name: attendance.professional.person_sig.nome,
          }
        : null,
      specialty: attendance.specialty ? attendance.specialty.name : null,
      location: attendance.location ? attendance.location.name : null,
      startDate: attendance.startAttendance,
      endDate: attendance.endAttendance,
      status: attendance.status,
    };
  }

  /**
   * Gera um novo código de verificação para um documento
   * @returns Código de verificação no formato SIG-XXXXXXXX-XXXXXX
   */
  generateVerificationCode(): string {
    // Gera um código alfanumérico aleatório
    const generateRandomString = (length: number) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Formato: SIG-XXXXXXXX-XXXXXX
    const prefix = 'SIG';
    const part1 = generateRandomString(8);
    const part2 = generateRandomString(6);

    return `${prefix}-${part1}-${part2}`;
  }

  /**
   * Verifica a autenticidade de um documento e suas assinaturas
   * @param documentId ID do documento
   * @returns Resultado da verificação
   */
  async verifyDocument(documentId: string) {
    this.logger.debug(`Verificando autenticidade do documento: ${documentId}`);

    // Verificar se o documento existe
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      return {
        isValid: false,
        message: 'Documento não encontrado',
      };
    }

    // Verificar assinaturas do documento
    const signatureVerification =
      await this.pdfSignerService.verifyDocumentSignatures(documentId);

    // Obter detalhes do documento
    const documentDetails = await this.getDocumentDetails(documentId);

    return {
      isValid: signatureVerification.isValid,
      document: {
        ...documentDetails,
        verificationUrl: `https://sigsaude.apps.pm.pb.gov.br/verificar`,
        signatures: signatureVerification.signatures,
      },
    };
  }

  /**
   * Verifica a autenticidade de um atendimento e suas assinaturas
   * @param attendanceId ID do atendimento
   * @returns Resultado da verificação
   */
  async verifyAttendance(attendanceId: string) {
    this.logger.debug(
      `Verificando autenticidade do atendimento: ${attendanceId}`,
    );

    // Verificar se o atendimento existe
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      return {
        isValid: false,
        message: 'Atendimento não encontrado',
      };
    }

    // Verificar assinaturas do atendimento
    const signatureVerification =
      await this.attendanceSignatureService.verifySignedPdf(attendanceId);

    // Obter detalhes do atendimento
    const attendanceDetails = await this.getAttendanceDetails(attendanceId);

    return {
      isValid: signatureVerification.isValid,
      document: {
        ...attendanceDetails,
        verificationUrl: `https://sigsaude.apps.pm.pb.gov.br/verificar`,
        signatures: signatureVerification.signatures.map((sig: any) => ({
          id: sig.id,
          name: sig.signer,
          role: 'Profissional de Saúde',
          date: sig.signedAt,
          isValid: sig.isValid,
        })),
      },
    };
  }

  /**
   * Verifica um documento ou atendimento pelo código
   * @param code Código de verificação ou código de atendimento
   * @returns Resultado da verificação
   */
  async verifyByCode(code: string) {
    this.logger.debug(`Verificando por código: ${code}`);

    // Verificar se é um código de atendimento (formato ATD...)
    if (code.startsWith('ATD')) {
      const attendance = await this.findAttendanceByCode(code);

      if (!attendance) {
        return {
          isValid: false,
          message: 'Atendimento não encontrado ou código inválido',
        };
      }

      return this.verifyAttendance(attendance.id);
    }
    // Verificar se é um código de verificação (formato SIG-...)
    else if (code.startsWith('SIG-')) {
      // Primeiro verificar se é uma assinatura de atendimento
      const attendanceSignature =
        await this.findAttendanceSignatureByVerificationCode(code);

      if (attendanceSignature) {
        return this.verifyAttendanceSignature(attendanceSignature);
      }

      // Se não for assinatura de atendimento, verificar se é documento
      const document = await this.findByVerificationCode(code);

      if (!document) {
        return {
          isValid: false,
          message:
            'Documento ou atendimento não encontrado ou código de verificação inválido',
        };
      }

      return this.verifyDocument(document.id);
    }
    // Código em formato inválido
    else {
      return {
        isValid: false,
        message:
          'Formato de código inválido. Use ATD... para atendimentos ou SIG-... para documentos',
      };
    }
  }

  /**
   * Verifica uma assinatura de atendimento
   * @param attendanceSignature Assinatura de atendimento
   * @returns Resultado da verificação
   */
  async verifyAttendanceSignature(attendanceSignature: AttendanceSignature) {
    this.logger.debug(
      `Verificando assinatura de atendimento com ID: ${attendanceSignature.id}`,
    );

    // Buscar o atendimento com relações
    const attendance = await this.attendanceRepository.findOne({
      where: { id: attendanceSignature.attendance_id },
      relations: [
        'patient',
        'patient.person_sig',
        'professional',
        'professional.person_sig',
      ],
    });

    if (!attendance) {
      return {
        isValid: false,
        message: 'Atendimento não encontrado',
      };
    }

    // Verificar se a assinatura é válida
    const isValid =
      attendanceSignature.status === AttendanceSignatureStatus.VALID;

    return {
      isValid,
      message: isValid
        ? 'Assinatura de atendimento verificada com sucesso'
        : 'Assinatura de atendimento inválida',
      document: {
        id: attendance.id,
        date: attendance.createdAt,
        signedAt: attendanceSignature.signed_at,
        patient: {
          name: attendance.patient?.person_sig?.nome,
          cpf: attendance.patient?.person_sig?.cpf,
        },
        professional: {
          name: attendance.professional?.person_sig?.nome,
          registration: attendance.professional?.person_sig?.matricula,
        },
        verificationCode: attendanceSignature.verification_code,
        verificationUrl: `https://sigsaude.apps.pm.pb.gov.br/verificar`,
        s3Location: attendanceSignature.s3_location,
      },
    };
  }
}
