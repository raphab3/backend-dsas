import { Injectable } from '@nestjs/common';
import TemplateRepository from '../typeorm/repositories/TemplateRepository';

@Injectable()
export class FindOneTemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}
  async findOne(id: string): Promise<any> {
    return this.templateRepository.findOne(id);
  }
}
