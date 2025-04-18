import { DatabasesModule } from '@shared/databases/databases.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuditModule from '@modules/audits/Audit.module';
import { Document } from './entities/document.entity';
import { User } from '@modules/users/typeorm/entities/user.entity';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import {
  FormTemplateMongo,
  FormTemplateMongoSchema,
} from '@modules/formsTemplates/schemas/forms_template.schema';
import { DocumentController } from './controllers/Document.controller';
import {
  FormResponseMongo,
  FormResponseMongoSchema,
} from '@modules/formResponses/schemas/form_response.schema';
import { ProvidersModule } from '@shared/providers/providers.module';
import { DocumentVersion } from './entities/documentVersion.entity';
import { SignatureRequirement } from './entities/signatureRequirement.entity';
import { CombineDocumentsService } from './services/combine-documents.service';
import { CreateDocumentService } from './services/create-document.service';
import { FindAllDocumentsService } from './services/find-all-documents.service';
import { FindDocumentByIdService } from './services/find-document-by-id.service';
import { GeneratePdfService } from './services/generate-pdf.service';
import { RequestSignatureService } from './services/request-signature.service';
import { UpdateDocumentService } from './services/update-document.service';
import { UploadDocumentService } from './services/upload-document.service';
import { DeleteDocumentService } from './services/delete-document.service';
import { CreateDocumentFromTemplateService } from './services/Create-document-from-template.service';
import { FormsResponseModule } from '@modules/formResponses/form_responses.module';
import { DigitalSignaturesModule } from '@modules/DigitalSignatures/digital-signatures.module';

const ENTITIES = TypeOrmModule.forFeature([
  Document,
  DocumentVersion,
  SignatureRequirement,
  FormTemplate,
  User,
]);

const SCHEMAS = MongooseModule.forFeature([
  { name: FormResponseMongo.name, schema: FormResponseMongoSchema },
  { name: FormTemplateMongo.name, schema: FormTemplateMongoSchema },
]);

const SERVICES = [
  CreateDocumentService,
  CreateDocumentFromTemplateService,
  UpdateDocumentService,
  DeleteDocumentService,
  FindAllDocumentsService,
  FindDocumentByIdService,
  GeneratePdfService,
  RequestSignatureService,
  UploadDocumentService,
  CombineDocumentsService,
];

const forwardRefModules = [forwardRef(() => DigitalSignaturesModule)];

@Module({
  controllers: [DocumentController],
  providers: [...SERVICES],
  imports: [
    ENTITIES,
    SCHEMAS,
    AuditModule,
    DatabasesModule,
    ProvidersModule,
    FormsResponseModule,
    ...forwardRefModules,
  ],
  exports: [
    CreateDocumentService,
    UpdateDocumentService,
    FindDocumentByIdService,
    GeneratePdfService,
  ],
})
export class DocumentModule {}
