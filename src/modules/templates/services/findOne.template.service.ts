import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';

@Injectable()
export class FindOneTemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async execute(uuid: string): Promise<Template> {
    const template = await this.templateRepository.findOne({
      where: { uuid },
    });

    if (!template) {
      throw new HttpException('Template não encontrado', 404);
    }

    return template;
  }
}
