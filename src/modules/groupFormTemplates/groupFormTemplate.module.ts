import { CreateGroupFormTemplateService } from './services/create.groupFormTemplate.service';
import { FindAllGroupFormTemplateService } from './services/findAll.groupFormTemplate.service';
import { FindOneGroupFormTemplateService } from './services/findOne.groupFormTemplate.service';
import { Module } from '@nestjs/common';
import { RemoveGroupFormTemplateService } from './services/remove.groupFormTemplate.service';
import { GroupFormTemplate } from './entities/groupFormTemplate.entity';
import { GroupFormTemplateController } from './controllers/groupFormTemplate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateGroupFormTemplateService } from './services/update.groupFormTemplate.service';
import AuditModule from '@modules/audits/Audit.module';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

const TYPE_ORM_TEMPLATES = TypeOrmModule.forFeature([
  GroupFormTemplate,
  FormTemplate,
  Specialty,
  Role,
]);

@Module({
  controllers: [GroupFormTemplateController],
  providers: [
    FindOneGroupFormTemplateService,
    CreateGroupFormTemplateService,
    FindAllGroupFormTemplateService,
    UpdateGroupFormTemplateService,
    RemoveGroupFormTemplateService,
  ],
  imports: [TYPE_ORM_TEMPLATES, AuditModule],
})
export class GroupFormTemplateModule {}
