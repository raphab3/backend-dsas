import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../entities/document.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { RequestSignatureDto } from '../dto/request-signature.dto';
import {
  SignatureRequirement,
  SignatureRequirementStatus,
} from '../entities/signatureRequirement.entity';
import { GeneratePdfService } from './generate-pdf.service';

@Injectable()
export class RequestSignatureService {
  private readonly logger = new Logger(RequestSignatureService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(SignatureRequirement)
    private signatureRequirementRepository: Repository<SignatureRequirement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private generatePdfService: GeneratePdfService,
  ) {}

  async execute(id: string, requestSignatureDto: RequestSignatureDto) {
    this.logger.log(`Solicitando assinaturas para documento ${id}`);

    // Buscar documento
    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new HttpException('Documento não encontrado', 404);
    }

    // Verificar se o documento pode receber assinaturas
    if (
      document.status === DocumentStatus.SIGNED ||
      document.status === DocumentStatus.ARCHIVED
    ) {
      throw new HttpException(
        'Documentos assinados ou arquivados não podem receber solicitações de assinatura',
        400,
      );
    }

    // Verificar se os usuários existem
    const userIds = requestSignatureDto.signatures.map((sig) => sig.user_id);
    const users = await this.userRepository.find({
      where: userIds.map((id) => ({ id })),
    });

    if (users.length !== userIds.length) {
      throw new HttpException('Um ou mais usuários não encontrados', 404);
    }

    try {
      // Criar requisitos de assinatura
      const signatureRequirements = requestSignatureDto.signatures.map(
        (signature) =>
          this.signatureRequirementRepository.create({
            document_id: document.id,
            user_id: signature.user_id,
            role: signature.role,
            order: signature.order,
            position_x: signature.position_x || null,
            position_y: signature.position_y || null,
            message: signature.message || null,
            status: SignatureRequirementStatus.PENDING,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias para expirar
          }),
      );

      const savedSignatures = await this.signatureRequirementRepository.save(
        signatureRequirements,
      );

      // Atualizar status do documento para PENDING se não estiver já
      if (document.status !== DocumentStatus.PENDING) {
        document.status = DocumentStatus.PENDING;
        document.next_action = 'Aguardando assinaturas';
        document.is_signature_required = true;
        await this.documentRepository.save(document);
      }

      // TODO: Implementar envio de notificações para os signatários
      // Poderia ser feito através de um serviço de notificação por email, por exemplo

      this.logger.log(
        `Solicitações de assinatura criadas com sucesso para documento ${id}`,
      );

      await this.generatePdfService.execute(document.id, document.created_by);
      return {
        document_id: document.id,
        signatures: savedSignatures,
        message: `${savedSignatures.length} solicitações de assinatura enviadas com sucesso`,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao solicitar assinaturas: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Erro ao solicitar assinaturas: ${error.message}`,
        400,
      );
    }
  }
}
