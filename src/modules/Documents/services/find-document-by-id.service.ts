import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FormResponseMongo,
  FormResponseMongoDocument,
} from '@modules/formResponses/schemas/form_response.schema';

@Injectable()
export class FindDocumentByIdService {
  private readonly logger = new Logger(FindDocumentByIdService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongoDocument>,
  ) {}

  async execute(id: string): Promise<any> {
    this.logger.log(`Buscando documento com ID: ${id}`);

    const document = await this.documentRepository.findOne({
      where: { id },
      relations: [
        'creator',
        'versions',
        'signatures',
        'signatures.user',
        'form_template',
      ],
    });

    if (!document) {
      this.logger.warn(`Documento com ID ${id} não encontrado`);
      throw new HttpException('Documento não encontrado', 404);
    }

    // Se o documento estiver baseado em um FormResponse, buscar os dados do MongoDB
    let formResponseData = null;
    if (document.form_response_id) {
      try {
        formResponseData = await this.formResponseModel
          .findById(document.form_response_id)
          .lean();
      } catch (error) {
        this.logger.warn(`Erro ao buscar form_response: ${error.message}`);
        // Não lançamos exceção aqui para não impedir o retorno do documento
      }
    }

    // Montar o objeto de resposta
    const result = {
      ...document,
      form_response_data: formResponseData,
    };

    this.logger.log(`Documento encontrado: ${document.id}`);
    return result;
  }
}
