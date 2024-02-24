import { Injectable } from '@nestjs/common';
import TemplateRepository from '../typeorm/repositories/TemplateRepository';

@Injectable()
export class CreateTemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async execute(createTemplateDto: any) {
    await this.templateRepository.create(createTemplateDto);
  }
}
