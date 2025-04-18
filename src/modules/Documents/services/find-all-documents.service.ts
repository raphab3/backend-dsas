import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { QueryDocumentDto } from '../dto/query-Document.dto';

@Injectable()
export class FindAllDocumentsService {
  private readonly logger = new Logger(FindAllDocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async execute(query: QueryDocumentDto): Promise<IPaginatedResult<Document>> {
    this.logger.log(
      'Buscando documentos com os parâmetros: ' + JSON.stringify(query),
    );

    let page = 1;
    let perPage = 10;

    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.creator', 'creator')
      .orderBy('document.created_at', 'DESC');

    const whereConditions: string[] = [];
    const parameters: Record<string, any> = {};

    if (query.id) {
      whereConditions.push('document.id = :id');
      parameters.id = query.id;
    }

    if (query.name) {
      whereConditions.push('document.name ILIKE :name');
      parameters.name = `%${query.name}%`;
    }

    if (query.type) {
      whereConditions.push('document.type = :type');
      parameters.type = query.type;
    }

    if (query.status) {
      whereConditions.push('document.status = :status');
      parameters.status = query.status;
    }

    if (query.created_by) {
      whereConditions.push('document.created_by = :created_by');
      parameters.created_by = query.created_by;
    }

    if (query.form_template_id) {
      whereConditions.push('document.form_template_id = :form_template_id');
      parameters.form_template_id = query.form_template_id;
    }

    if (whereConditions.length > 0) {
      queryBuilder.where(`(${whereConditions.join(' AND ')})`, parameters);
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<Document> = await paginate(queryBuilder, {
      page,
      perPage,
    });

    this.logger.log(
      `Encontrados ${result.data.length} documentos (total: ${result.pagination.total})`,
    );

    return result;
  }
}
