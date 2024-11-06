import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GroupFormTemplate } from '../entities/groupFormTemplate.entity';
import { UpdateGroupFormTemplateDto } from '../dto/update-groupFormTemplate.dto';
import { FormTemplate } from '@modules/formsTemplates/entities/forms_template.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Role } from '@modules/roles/typeorm/entities/role.entity';

@Injectable()
export class UpdateGroupFormTemplateService {
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

  private async findGroupTemplateById(id: string): Promise<GroupFormTemplate> {
    const groupTemplate = await this.groupFormTemplateRepository.findOne({
      where: { id },
      relations: ['templates', 'specialties', 'roles'],
    });

    if (!groupTemplate) {
      throw new HttpException('GroupFormTemplate não encontrado', 404);
    }

    return groupTemplate;
  }

  private async updateTemplates(
    groupTemplate: GroupFormTemplate,
    templateIds?: string[],
  ): Promise<void> {
    if (templateIds !== undefined) {
      if (templateIds.length > 0) {
        const templates = await this.formTemplateRepository.findBy({
          id: In(templateIds),
        });
        if (templates.length !== templateIds.length) {
          throw new HttpException(
            'Um ou mais templates não foram encontrados',
            400,
          );
        }
        groupTemplate.templates = templates;
      } else {
        groupTemplate.templates = [];
      }
    }
  }

  private async updateSpecialties(
    groupTemplate: GroupFormTemplate,
    specialtyIds?: string[],
  ): Promise<void> {
    if (specialtyIds !== undefined) {
      if (specialtyIds.length > 0) {
        const specialties = await this.specialtyRepository.findBy({
          id: In(specialtyIds),
        });
        if (specialties.length !== specialtyIds.length) {
          throw new HttpException(
            'Uma ou mais especialidades não foram encontradas',
            400,
          );
        }
        groupTemplate.specialties = specialties;
      } else {
        groupTemplate.specialties = [];
      }
    }
  }

  private async updateRoles(
    groupTemplate: GroupFormTemplate,
    rolesIds?: string[],
  ): Promise<void> {
    if (rolesIds !== undefined) {
      if (rolesIds.length > 0) {
        const roles = await this.roleRepository.findBy({
          id: In(rolesIds),
        });
        if (roles.length !== rolesIds.length) {
          throw new HttpException(
            'Uma ou mais roles não foram encontradas',
            400,
          );
        }
        groupTemplate.roles = roles;
      } else {
        groupTemplate.roles = [];
      }
    }
  }

  async update(
    id: string,
    updateGroupFormTemplateDto: UpdateGroupFormTemplateDto,
  ): Promise<GroupFormTemplate> {
    const { templateIds, specialtyIds, roleIds, ...updateData } =
      updateGroupFormTemplateDto;

    // Buscar o grupo existente com seus relacionamentos
    const existingGroupTemplate = await this.findGroupTemplateById(id);

    try {
      // Atualizar propriedades básicas
      Object.assign(existingGroupTemplate, updateData);

      // Atualizar relacionamentos
      await Promise.all([
        this.updateTemplates(existingGroupTemplate, templateIds),
        this.updateSpecialties(existingGroupTemplate, specialtyIds),
        this.updateRoles(existingGroupTemplate, roleIds),
      ]);

      // Salvar as alterações
      const updatedGroupTemplate = await this.groupFormTemplateRepository.save(
        existingGroupTemplate,
      );

      // Retornar o objeto atualizado com seus relacionamentos
      return this.groupFormTemplateRepository.findOne({
        where: { id: updatedGroupTemplate.id },
        relations: ['templates', 'specialties', 'roles'],
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao atualizar o grupo de formulários: ' + error.message,
        500,
      );
    }
  }
}
