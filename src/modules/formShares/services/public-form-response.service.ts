import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormShareToken } from '../entities/formShareToken.entity';
import { FormShareService } from './form-share.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormResponseMongo } from '@modules/formResponses/schemas/form_response.schema';
import { FormTemplateMongo } from '@modules/formsTemplates/schemas/forms_template.schema';

@Injectable()
export class PublicFormResponseService {
  constructor(
    @InjectRepository(FormShareToken)
    private formShareTokenRepository: Repository<FormShareToken>,
    private formShareService: FormShareService,
    @InjectModel(FormResponseMongo.name)
    private formResponseModel: Model<FormResponseMongo>,
    @InjectModel(FormTemplateMongo.name)
    private formTemplateModel: Model<FormTemplateMongo>,
  ) {}

  /**
   * Obtém um template de formulário pelo ID
   */
  async getFormTemplate(formTemplateId: string): Promise<FormTemplateMongo> {
    const formTemplate = await this.formTemplateModel.findById(formTemplateId);

    if (!formTemplate) {
      throw new NotFoundException('Template de formulário não encontrado');
    }

    return formTemplate;
  }

  /**
   * Obtém uma resposta de formulário pelo ID
   */
  async getFormResponse(formResponseId: string): Promise<FormResponseMongo> {
    const formResponse = await this.formResponseModel.findById(formResponseId);

    if (!formResponse) {
      throw new NotFoundException('Resposta de formulário não encontrada');
    }

    return formResponse;
  }

  /**
   * Salva uma resposta de formulário público
   */
  async saveFormResponse(
    tokenId: string,
    formData: any,
  ): Promise<{ success: boolean; message: string }> {
    // Buscar o token
    const token = await this.formShareTokenRepository.findOne({
      where: { id: tokenId },
      relations: ['patient', 'attendance'],
    });

    if (!token) {
      throw new NotFoundException('Token inválido');
    }

    if (token.used) {
      throw new BadRequestException('Este formulário já foi preenchido');
    }

    if (new Date() > token.expiresAt) {
      throw new BadRequestException('Este link de formulário expirou');
    }

    // Buscar a resposta do formulário
    const formResponse = await this.getFormResponse(token.formResponseId);

    // Atualizar a resposta do formulário com os novos dados
    formResponse.sessions = formData.sessions || [];

    // Adicionar metadata para indicar que veio de um link público
    if (!formResponse.metadata) {
      formResponse.metadata = [];
    }

    formResponse.metadata.push({
      key: 'source',
      value: 'public_link',
    });

    // Salvar a resposta usando o ID como string
    const savedResponse = await this.formResponseModel.findByIdAndUpdate(
      formResponse['_id'].toString(),
      formResponse,
      { new: true },
    );

    // Marcar o token como usado
    await this.formShareService.markAsUsed(
      token.id,
      savedResponse._id.toString(),
    );

    return {
      success: true,
      message: 'Formulário enviado com sucesso',
    };
  }
}
