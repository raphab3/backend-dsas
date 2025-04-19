import {
  Controller,
  Get,
  Param,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DocumentVerificationService } from '../services/document-verification.service';
import { Public } from '@shared/decorators';

@ApiTags('Verificação de Documentos')
@Controller('documents')
export class DocumentVerificationController {
  private readonly logger = new Logger(DocumentVerificationController.name);

  constructor(
    private readonly documentVerificationService: DocumentVerificationService,
  ) {}

  @Public()
  @Get('verify/:code')
  @ApiOperation({ summary: 'Verificar documento por código de verificação' })
  @ApiParam({
    name: 'code',
    description:
      'Código de verificação (formato: SIG-XXXXXXXX-XXXXXX) ou código de atendimento (formato: ATD...)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Documento verificado com sucesso',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        document: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            title: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            verificationCode: { type: 'string' },
            verificationUrl: { type: 'string' },
            signatures: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  role: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                  isValid: { type: 'boolean' },
                  certificateInfo: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      issuedBy: { type: 'string' },
                      validUntil: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Código de verificação em formato inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento não encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async verifyDocument(@Param('code') code: string) {
    try {
      this.logger.log(
        `Verificando documento ou atendimento com código: ${code}`,
      );

      // Usar o serviço de verificação para verificar o código
      return await this.documentVerificationService.verifyByCode(code);
    } catch (error) {
      this.logger.error(
        `Erro ao verificar documento ou atendimento: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro interno ao verificar o documento ou atendimento',
      );
    }
  }
}
