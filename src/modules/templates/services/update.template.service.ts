import { HttpException, Injectable } from '@nestjs/common';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../entities/template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateTemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async update(
    uuid: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<void> {
    const template = await this.templateRepository.findOne({
      where: { uuid },
    });

    if (!template) {
      throw new HttpException('Template não encontrado', 404);
    }

    await this.templateRepository.update(uuid, updateTemplateDto);
  }
}
