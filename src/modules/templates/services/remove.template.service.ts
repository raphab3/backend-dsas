import { Injectable } from '@nestjs/common';
import TemplateRepository from '../typeorm/repositories/TemplateRepository';

@Injectable()
export class RemoveTemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}
  remove(id: string) {
    return this.templateRepository.delete(id);
  }
}
