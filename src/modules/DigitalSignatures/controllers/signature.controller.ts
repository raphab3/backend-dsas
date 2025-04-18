// src/modules/digital-signatures/controllers/signature.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { SignatureService } from '../services/signature.service';
import { PdfSignerService } from '../services/pdf-signer.service';
import { DocumentSignature } from '../entities/document-signature.entity';
import { SignDocumentDto } from '@modules/DigitalSignatures/dto/sign-Document.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('digital-signatures')
@Controller('digital-signatures')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class SignatureController {
  private readonly logger = new Logger(SignatureController.name);
  constructor(
    private readonly signatureService: SignatureService,
    private readonly pdfSignerService: PdfSignerService,
  ) {}

  @Post('sign')
  @AuditLog('ASSINAR DOCUMENTO')
  @ApiOperation({ summary: 'Sign a document with a digital certificate' })
  async signDocument(
    @Req() req: any,
    @Body() signDocumentDto: SignDocumentDto,
  ) {
    return this.signatureService.signDocument({
      documentId: signDocumentDto.documentId,
      userId: req.user.userId,
      certificateId: signDocumentDto.certificate_id,
      password: signDocumentDto.password,
      signatureRequirementId: signDocumentDto.signatureRequirementId,
      reason: signDocumentDto.comments,
      signaturePosition: signDocumentDto.signaturePosition,
    });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending signatures for the user' })
  @ApiResponse({
    status: 200,
    description: 'List of pending signature requests',
  })
  async getPendingSignatures(@Req() req: any) {
    return this.signatureService.getPendingSignatures(req.user.userId);
  }

  @Get('signed')
  @ApiOperation({ summary: 'Get documents signed by the user' })
  @ApiResponse({ status: 200, description: 'List of signed documents' })
  async getSignedDocuments(@Req() req: any) {
    return this.signatureService.getSignedDocuments(req.user.userId);
  }

  @Get('signature/:id/download')
  @ApiOperation({ summary: 'Get download URL for a signed document' })
  @ApiResponse({ status: 200, description: 'Signed document URL' })
  async getSignedDocumentUrl(@Param('id') signatureId: string) {
    const url = await this.pdfSignerService.getSignedDocumentUrl(signatureId);
    return { url };
  }

  @Get('signature/:id')
  @ApiOperation({ summary: 'Get details of a signature' })
  @ApiResponse({
    status: 200,
    description: 'Signature details',
    type: DocumentSignature,
  })
  async getSignature(@Param('id') signatureId: string) {
    return this.pdfSignerService.getSignatureById(signatureId);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a signed PDF document' })
  @UseInterceptors(FileInterceptor('file'))
  async validateDocument(@UploadedFile() file: any) {
    if (!file) {
      throw new HttpException('No file uploaded', 400);
    }

    this.logger.debug(`Validating uploaded PDF - Size: ${file.size} bytes`);
    return this.pdfSignerService.validateUploadedDocument(file.buffer);
  }
}
