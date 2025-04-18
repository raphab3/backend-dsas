import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { FormShareService } from '../services/form-share.service';
import { CreateFormShareDto } from '../dto/create-form-share.dto';
import { Public } from '@shared/decorators';

@ApiTags('form-shares')
@Controller('form-shares')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class FormShareController {
  constructor(private readonly formShareService: FormShareService) {}

  @Post()
  @AuditLog('CRIAR COMPARTILHAMENTO DE FORMULÁRIO')
  @ApiOperation({ summary: 'Criar um link de compartilhamento de formulário' })
  @ApiResponse({
    status: 201,
    description: 'Link de formulário criado com sucesso',
  })
  @Permission(PermissionsEnum.create_form_response)
  async createFormShare(@Body() createFormShareDto: CreateFormShareDto) {
    const token =
      await this.formShareService.createFormShare(createFormShareDto);
    const formUrl = this.formShareService.getFormUrl(token.shortCode);

    return {
      id: token.id,
      shortCode: token.shortCode,
      formUrl,
      expiresAt: token.expiresAt,
    };
  }

  @Get('validate/:shortCode')
  @Public()
  @ApiOperation({ summary: 'Validar um código de compartilhamento' })
  @ApiResponse({
    status: 200,
    description: 'Código válido, retorna informações do formulário',
  })
  async validateShortCode(@Param('shortCode') shortCode: string) {
    try {
      const token = await this.formShareService.getByShortCode(shortCode);

      return {
        tokenId: token.id,
        formResponseId: token.formResponseId,
        patientId: token.patientId,
        attendanceId: token.attendanceId,
        expiresAt: token.expiresAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Link de formulário inválido ou expirado');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
