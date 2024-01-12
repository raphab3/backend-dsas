import { CreateTemplateDto } from '@modules/templates/dto/create-template.dto';
import { Template } from '../entities/template.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';

export default interface ITemplateRepository {
  create(data: CreateTemplateDto): Promise<Template>;
  list(query: any): Promise<IPaginatedResult<any>>;
  findOne(id: string): Promise<Template | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: CreateTemplateDto): Promise<Template>;
}
