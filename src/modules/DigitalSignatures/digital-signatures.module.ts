import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Certificate } from './entities/certificate.entity';
import { DocumentSignature } from './entities/document-signature.entity';
import { CertificateService } from './services/certificate.service';
import { InternalCaService } from './services/internal-ca.service';
import { PdfSignerService } from './services/pdf-signer.service';
import { SignatureService } from './services/signature.service';
import { CertificateController } from './controllers/certificate.controller';
import { SignatureController } from './controllers/signature.controller';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { S3Provider } from '@shared/providers/StorageProvider/services/S3StorageProvider';
import { Document } from '@modules/Documents/entities/document.entity';
import { DocumentVersion } from '@modules/Documents/entities/documentVersion.entity';
import { SignatureRequirement } from '@modules/Documents/entities/signatureRequirement.entity';
import AuditModule from '@modules/audits/Audit.module';
import { SignPdfProvider } from './providers/signpdf-provider';
import { DocumentModule } from '@modules/Documents/Document.module';

const forwardRefModules = [forwardRef(() => DocumentModule)];
@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forFeature([
      Certificate,
      DocumentSignature,
      Document,
      DocumentVersion,
      SignatureRequirement,
      User,
    ]),
    ConfigModule,
    ...forwardRefModules,
  ],
  controllers: [CertificateController, SignatureController],
  providers: [
    CertificateService,
    InternalCaService,
    PdfSignerService,
    SignPdfProvider,
    SignatureService,
    S3Provider,
  ],
  exports: [CertificateService, PdfSignerService, SignatureService],
})
export class DigitalSignaturesModule {}
