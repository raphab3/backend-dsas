import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Body,
  UseGuards,
  UseInterceptors,
  Post,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { CreateDocumentService } from '../services/create-document.service';
import { UpdateDocumentService } from '../services/update-document.service';
import { FindAllDocumentsService } from '../services/find-all-documents.service';
import { FindDocumentByIdService } from '../services/find-document-by-id.service';
import { GeneratePdfService } from '../services/generate-pdf.service';
import { RequestSignatureService } from '../services/request-signature.service';
import { UploadDocumentService } from '../services/upload-document.service';
import { CombineDocumentsService } from '../services/combine-documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CombineDocumentsDto } from '../dto/combine-Document.dto';
import { CreateDocumentDto } from '../dto/create-Document.dto';
import { QueryDocumentDto } from '../dto/query-Document.dto';
import { RequestSignatureDto } from '../dto/request-signature.dto';
import { UpdateDocumentDto } from '../dto/update-Document.dto';
import { DeleteDocumentService } from '../services/delete-document.service';
import { CreateDocumentFromTemplateService } from '../services/Create-document-from-template.service';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { DocumentSignature } from '@modules/DigitalSignatures/entities/document-signature.entity';
import { PdfSignerService } from '@modules/DigitalSignatures/services/pdf-signer.service';
import { Response } from 'express';
import { Public } from '@shared/decorators';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class DocumentController {
  constructor(
    private readonly createDocumentService: CreateDocumentService,
    private readonly createDocumentFromTemplateService: CreateDocumentFromTemplateService,
    private readonly updateDocumentService: UpdateDocumentService,
    private readonly deleteDocumentService: DeleteDocumentService,
    private readonly findAllDocumentsService: FindAllDocumentsService,
    private readonly findDocumentByIdService: FindDocumentByIdService,
    private readonly generatePdfService: GeneratePdfService,
    private readonly requestSignatureService: RequestSignatureService,
    private readonly uploadDocumentService: UploadDocumentService,
    private readonly combineDocumentsService: CombineDocumentsService,
    private readonly pdfSignerService: PdfSignerService,
    private readonly s3Provider: S3Provider,
  ) {}

  @Post()
  @AuditLog('CRIAR DOCUMENTO')
  @ApiOperation({ summary: 'Create a new document' })
  create(@Req() req: any, @Body() createDocumentDto: CreateDocumentDto) {
    console.log('req', req.user);
    return this.createDocumentService.execute({
      ...createDocumentDto,
      created_by: req.user.userId,
    });
  }

  @Post('from-template/:templateId')
  @AuditLog('CRIAR DOCUMENTO A PARTIR DE TEMPLATE')
  @ApiOperation({ summary: 'Create a document from a form template' })
  createFromTemplate(@Req() req: any, @Param('templateId') templateId: string) {
    return this.createDocumentFromTemplateService.execute({
      form_template_id: templateId,
      created_by: req.user.userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Find all documents' })
  findAll(@Query() query: QueryDocumentDto) {
    return this.findAllDocumentsService.execute(query);
  }

  @Get('download-url')
  @ApiOperation({ summary: 'Get document download URL' })
  async getDownloadUrl(@Query('key') key: string) {
    console.log('key', key);
    const signedUrl = await this.s3Provider.getSignedUrl(key, 3600);
    return { download_url: signedUrl };
  }

  @Get('download')
  @Public()
  @ApiOperation({ summary: 'Download file directly' })
  async downloadFile(@Query('key') key: string, @Res() res: Response) {
    try {
      if (!key) {
        throw new HttpException(
          'Key parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verify if the file exists
      const exists = await this.s3Provider.objectExists(key);
      if (!exists) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      // Get the file content
      const fileBuffer = await this.s3Provider.downloadContent(key);

      // Determine content type based on file extension
      const contentType = key.endsWith('.pdf')
        ? 'application/pdf'
        : 'application/octet-stream';

      // Set response headers
      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        contentType === 'application/pdf' ? 'inline' : 'attachment',
      );

      // Send the file
      return res.send(fileBuffer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error downloading file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find document by id' })
  findById(@Param('id') id: string) {
    return this.findDocumentByIdService.execute(id);
  }

  @Patch(':id')
  @AuditLog('ATUALIZAR DOCUMENTO')
  @ApiOperation({ summary: 'Update document by id' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.updateDocumentService.execute(id, {
      ...updateDocumentDto,
      last_updated_by: req.user.userId,
    });
  }

  @Delete(':id')
  @AuditLog('DELETAR DOCUMENTO')
  @ApiOperation({ summary: 'Delete document by id' })
  delete(@Param('id') id: string) {
    return this.deleteDocumentService.execute(id);
  }

  @Post(':id/generate-pdf')
  @AuditLog('GERAR PDF')
  @ApiOperation({ summary: 'Generate PDF for document' })
  generatePdf(@Req() req: any, @Param('id') id: string) {
    return this.generatePdfService.execute(id, req.user.userId);
  }

  @Post(':id/request-signature')
  @AuditLog('SOLICITAR ASSINATURA')
  @ApiOperation({ summary: 'Request signature for document' })
  requestSignature(
    @Req() req: any,
    @Param('id') id: string,
    @Body() requestSignatureDto: RequestSignatureDto,
  ) {
    return this.requestSignatureService.execute(id, {
      ...requestSignatureDto,
      requester_id: req.user.userId,
    });
  }

  @Get('document/:id/signatures')
  @ApiOperation({ summary: 'Get all signatures for a document' })
  @ApiResponse({
    status: 200,
    description: 'List of signatures',
    type: [DocumentSignature],
  })
  async getDocumentSignatures(@Param('id') documentId: string) {
    return this.pdfSignerService.getDocumentSignatures(documentId);
  }

  @Get('document/:id/verify')
  @ApiOperation({ summary: 'Verify signatures of a document' })
  @ApiResponse({ status: 200, description: 'Signature verification result' })
  async verifyDocumentSignatures(@Param('id') documentId: string) {
    return this.pdfSignerService.verifyDocumentSignatures(documentId);
  }

  @Get('document/:id/versions')
  @ApiOperation({ summary: 'Get all versions of a document' })
  @ApiResponse({
    status: 200,
    description: 'List of document versions',
  })
  async getDocumentVersions(@Param('id') documentId: string) {
    return this.pdfSignerService.getDocumentVersions(documentId);
  }

  @Get('version/:id/download')
  @ApiOperation({ summary: 'Get download URL for a specific document version' })
  @ApiResponse({ status: 200, description: 'Version download URL' })
  async getVersionDownloadUrl(@Param('id') versionId: string) {
    const url = await this.pdfSignerService.getVersionDownloadUrl(versionId);
    return { url };
  }

  @Post('upload')
  @AuditLog('UPLOAD DOCUMENTO')
  @ApiOperation({ summary: 'Upload document' })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body()
    metadata: {
      name?: string;
      description?: string;
      header_template_id?: string;
      footer_template_id?: string;
    },
  ) {
    return this.uploadDocumentService.execute(file, {
      ...metadata,
      created_by: req.user.userId,
    });
  }

  @Post('combine')
  @AuditLog('COMBINAR DOCUMENTOS')
  @ApiOperation({ summary: 'Combine multiple documents' })
  combine(@Req() req: any, @Body() combineDocumentsDto: CombineDocumentsDto) {
    return this.combineDocumentsService.execute({
      ...combineDocumentsDto,
      created_by: req.user.userId,
    });
  }
}
