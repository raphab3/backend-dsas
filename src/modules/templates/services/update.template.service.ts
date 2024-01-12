import { Injectable } from '@nestjs/common';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import TemplateRepository from '../typeorm/repositories/TemplateRepository';

@Injectable()
export class UpdateTemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}
  update(id: string, updateTemplateDto: UpdateTemplateDto) {
    return this.templateRepository.update(id, updateTemplateDto);
  }
}
