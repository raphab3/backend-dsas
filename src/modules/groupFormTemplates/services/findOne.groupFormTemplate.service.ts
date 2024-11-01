import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupFormTemplate } from '../entities/groupFormTemplate.entity';

@Injectable()
export class FindOneGroupFormTemplateService {
  constructor(
    @InjectRepository(GroupFormTemplate)
    private groupFormTemplateRepository: Repository<GroupFormTemplate>,
  ) {}

  async execute(id: string): Promise<GroupFormTemplate> {
    const groupFormTemplate = await this.groupFormTemplateRepository.findOne({
      where: { id },
    });

    if (!groupFormTemplate) {
      throw new HttpException('GroupFormTemplate não encontrado', 404);
    }

    return groupFormTemplate;
  }
}
