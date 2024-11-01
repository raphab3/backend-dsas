import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';

@Injectable()
export class RemoveTemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async remove(uuid: string): Promise<void> {
    const template = await this.templateRepository.findOne({
      where: { uuid },
    });

    if (!template) {
      throw new HttpException('Template não encontrado', 404);
    }

    await this.templateRepository.remove(template);
  }
}
