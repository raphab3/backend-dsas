import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupFormTemplate } from '../entities/groupFormTemplate.entity';
import { In, Repository } from 'typeorm';
import { CreateGroupFormTemplateDto } from '../dto/create-groupFormTemplate.dto';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

@Injectable()
export class CreateGroupFormTemplateService {
  constructor(
    @InjectRepository(GroupFormTemplate)
    private groupFormTemplateRepository: Repository<GroupFormTemplate>,
    @InjectRepository(FormTemplate)
    private formTemplateRepository: Repository<FormTemplate>,
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async execute(createGroupFormTemplateDto: CreateGroupFormTemplateDto) {
    const { templateIds, specialtyIds, rolesIds, ...groupFormTemplateData } =
      createGroupFormTemplateDto;

    // Criar instância do GroupFormTemplate
    const groupFormTemplate = this.groupFormTemplateRepository.create(
      groupFormTemplateData,
    );

    // Se houver Roles no DTO, buscar as Roles e adicionar ao relacionamento
    if (rolesIds && rolesIds.length > 0) {
      const roles = await this.roleRepository.findBy({
        id: In(rolesIds),
      });
      groupFormTemplate.roles = roles;
    }

    // Se houver templateIds, buscar os templates e adicionar ao relacionamento
    if (templateIds && templateIds.length > 0) {
      const templates = await this.formTemplateRepository.findBy({
        id: In(templateIds),
      });
      groupFormTemplate.templates = templates;
    }

    // Se houver specialtyIds, buscar as especialidades e adicionar ao relacionamento
    if (specialtyIds && specialtyIds.length > 0) {
      const specialties = await this.specialtyRepository.findBy({
        id: In(specialtyIds),
      });
      groupFormTemplate.specialties = specialties;
    }

    // Salvar o GroupFormTemplate com seus relacionamentos
    const groupFormTemplateSaved =
      await this.groupFormTemplateRepository.save(groupFormTemplate);

    // Buscar o grupo salvo com seus relacionamentos
    return this.groupFormTemplateRepository.findOne({
      where: { id: groupFormTemplateSaved.id },
      relations: ['templates', 'specialties', 'roles'],
    });
  }
}
