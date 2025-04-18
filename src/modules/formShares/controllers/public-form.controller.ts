import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FormShareService } from '../services/form-share.service';
import { PublicFormResponseService } from '../services/public-form-response.service';
import { Public } from '@shared/decorators';

@ApiTags('public-forms')
@Controller('public-forms')
@Public()
export class PublicFormController {
  constructor(
    private readonly formShareService: FormShareService,
    private readonly publicFormResponseService: PublicFormResponseService,
  ) {}

  @Get(':shortCode')
  @ApiOperation({ summary: 'Obter informações do formulário público' })
  @ApiResponse({
    status: 200,
    description: 'Retorna as informações do formulário',
  })
  async getFormInfo(@Param('shortCode') shortCode: string) {
    try {
      const token = await this.formShareService.getByShortCode(shortCode);
      const formResponse = await this.publicFormResponseService.getFormResponse(
        token.formResponseId,
      );

      return {
        tokenId: token.id,
        formResponse: {
          name: formResponse.name,
          description: formResponse.description,
          sessions: formResponse.sessions,
        },
        patientId: token.patientId,
        expiresAt: token.expiresAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Formulário não encontrado ou expirado');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post(':tokenId/submit')
  @ApiOperation({ summary: 'Enviar resposta de formulário público' })
  @ApiResponse({
    status: 201,
    description: 'Resposta enviada com sucesso',
  })
  async submitFormResponse(
    @Param('tokenId') tokenId: string,
    @Body() formData: any,
  ) {
    try {
      return await this.publicFormResponseService.saveFormResponse(
        tokenId,
        formData,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
