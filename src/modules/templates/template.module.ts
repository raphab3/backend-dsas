import { CreateTemplateService } from './services/create.template.service';
import { FindAllTemplateService } from './services/findAll.template.service';
import { FindOneTemplateService } from './services/findOne.template.service';
import { Module } from '@nestjs/common';
import { RemoveTemplateService } from './services/remove.template.service';
import { Template } from './entities/template.entity';
import { TemplateController } from './controllers/template.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateTemplateService } from './services/update.template.service';
import AuditModule from '@modules/audits/Audit.module';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([Template]);

@Module({
  controllers: [TemplateController],
  providers: [
    FindOneTemplateService,
    CreateTemplateService,
    FindAllTemplateService,
    UpdateTemplateService,
    RemoveTemplateService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
})
export class TemplateModule {}
