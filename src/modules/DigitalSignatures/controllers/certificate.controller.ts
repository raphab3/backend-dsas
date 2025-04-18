import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  HttpCode,
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
import { CertificateService } from '../services/certificate.service';
import { CreateCertificateDto } from '../dto/create-certificate.dto';
import { ImportCertificateDto } from '../dto/import-certificate.dto';
import { Certificate } from '../entities/certificate.entity';

@ApiTags('digital-certificates')
@Controller('digital-certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @AuditLog('CRIAR CERTIFICADO DIGITAL')
  @ApiOperation({ summary: 'Create a new digital certificate' })
  @ApiResponse({
    status: 201,
    description: 'Certificate created successfully',
    type: Certificate,
  })
  async createCertificate(
    @Req() req: any,
    @Body() createCertificateDto: CreateCertificateDto,
  ): Promise<Certificate> {
    return this.certificateService.createInternalCertificate({
      userId: req.user.userId,
      name: createCertificateDto.name,
      password: createCertificateDto.password,
      validityDays: createCertificateDto.validityDays,
      isDefault: createCertificateDto.isDefault,
      userInfo: createCertificateDto.userInfo,
    });
  }

  @Post('import')
  @AuditLog('IMPORTAR CERTIFICADO DIGITAL')
  @ApiOperation({ summary: 'Import an external digital certificate' })
  @ApiResponse({
    status: 201,
    description: 'Certificate imported successfully',
    type: Certificate,
  })
  async importCertificate(
    @Req() req: any,
    @Body() importCertificateDto: ImportCertificateDto,
  ): Promise<Certificate> {
    return this.certificateService.importExternalCertificate({
      userId: req.user.userId,
      name: importCertificateDto.name,
      certificatePem: importCertificateDto.certificatePem,
      privateKeyPem: importCertificateDto.privateKeyPem,
      password: importCertificateDto.password,
      provider: importCertificateDto.provider,
      isDefault: importCertificateDto.isDefault,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all user certificates' })
  @ApiResponse({
    status: 200,
    description: 'List of certificates',
    type: [Certificate],
  })
  async getUserCertificates(@Req() req: any): Promise<Certificate[]> {
    return this.certificateService.getUserCertificates(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certificate by ID' })
  @ApiResponse({
    status: 200,
    description: 'Certificate details',
    type: Certificate,
  })
  async getCertificate(@Param('id') id: string): Promise<Certificate> {
    return this.certificateService.getCertificateById(id);
  }

  @Put(':id/set-default')
  @AuditLog('DEFINIR CERTIFICADO PADRÃO')
  @ApiOperation({ summary: 'Set certificate as default' })
  @ApiResponse({
    status: 200,
    description: 'Certificate set as default',
    type: Certificate,
  })
  async setDefaultCertificate(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<Certificate> {
    return this.certificateService.setDefaultCertificate(id, req.user.userId);
  }

  @Delete(':id')
  @AuditLog('REVOGAR CERTIFICADO')
  @HttpCode(204)
  @ApiOperation({ summary: 'Revoke certificate' })
  @ApiResponse({ status: 204, description: 'Certificate revoked' })
  async revokeCertificate(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.certificateService.revokeCertificate(id, req.user.userId);
  }
}
