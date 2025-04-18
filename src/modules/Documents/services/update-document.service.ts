import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../entities/document.entity';
import { UpdateDocumentDto } from '../dto/update-Document.dto';
import { GeneratePdfService } from './generate-pdf.service';

@Injectable()
export class UpdateDocumentService {
  private readonly logger = new Logger(UpdateDocumentService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private readonly generatePdfService: GeneratePdfService,
  ) {}

  async execute(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    this.logger.log(`Atualizando documento com ID: ${id}`);

    const document = await this.documentRepository.findOne({
      where: { id },
    });

    if (!document) {
      this.logger.warn(`Documento com ID ${id} não encontrado`);
      throw new HttpException('Documento não encontrado', 404);
    }

    // Verificar se o documento pode ser editado
    if (
      document.status === DocumentStatus.SIGNED ||
      document.status === DocumentStatus.ARCHIVED
    ) {
      this.logger.warn(
        `Documento com ID ${id} não pode ser editado (status: ${document.status})`,
      );
      throw new HttpException(
        'Documentos assinados ou arquivados não podem ser editados',
        400,
      );
    }

    try {
      // Atualizar campos
      if (updateDocumentDto.name !== undefined) {
        document.name = updateDocumentDto.name;
      }

      if (updateDocumentDto.description !== undefined) {
        document.description = updateDocumentDto.description;
      }

      if (updateDocumentDto.status !== undefined) {
        document.status = updateDocumentDto.status;
      }

      if (updateDocumentDto.next_action !== undefined) {
        document.next_action = updateDocumentDto.next_action;
      }

      if (updateDocumentDto.content !== undefined) {
        document.content = updateDocumentDto.content;
      }

      if (updateDocumentDto.header_template_id !== undefined) {
        document.header_template_id = updateDocumentDto.header_template_id;
      }

      if (updateDocumentDto.footer_template_id !== undefined) {
        document.footer_template_id = updateDocumentDto.footer_template_id;
      }

      if (updateDocumentDto.is_signature_required !== undefined) {
        document.is_signature_required =
          updateDocumentDto.is_signature_required;
      }

      const updatedDocument = await this.documentRepository.save(document);
      this.logger.log(
        `Documento atualizado com sucesso: ${updatedDocument.id}`,
      );

      // Gerar PDF
      await this.generatePdfService.execute(
        updatedDocument.id,
        updateDocumentDto.last_updated_by,
      );
      this.logger.log(`PDF gerado para documento ${updatedDocument.id}`);

      return updatedDocument;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar documento: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Erro ao atualizar documento: ${error.message}`,
        400,
      );
    }
  }
}
