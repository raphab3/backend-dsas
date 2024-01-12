import { Injectable } from '@nestjs/common';
import TemplateRepository from '../typeorm/repositories/TemplateRepository';

@Injectable()
export class FindAllTemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async findAll(query: any): Promise<any> {
    return this.templateRepository.list(query);
  }
}
