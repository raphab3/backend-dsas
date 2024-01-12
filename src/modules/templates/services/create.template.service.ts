import { Injectable } from '@nestjs/common';
import TemplateRepository from '../typeorm/repositories/TemplateRepository';

@Injectable()
export class CreateTemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async execute(createTemplateDto: any) {
    const saved = await this.templateRepository.create(createTemplateDto);
    console.log('CreateTemplateService -> saved', saved);
  }
}
