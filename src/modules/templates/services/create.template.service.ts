import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from '../entities/template.entity';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from '../dto/create-template.dto';

@Injectable()
export class CreateTemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async execute(createTemplateDto: CreateTemplateDto) {
    const createTemplate = this.templateRepository.create(createTemplateDto);
    const templateSaved = await this.templateRepository.save(createTemplate);

    return templateSaved;
  }
}
