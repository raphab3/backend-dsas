import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Body,
  UseGuards,
  UseInterceptors,
  Post,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { CreateFormResponseService } from '../services/create.formResponse.service';
import { CreateFormResponseDto } from '../dto/create-form_response.dto';

@ApiTags('forms-responses')
@Controller('forms-responses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class FormResponseController {
  constructor(
    private readonly createFormResponseService: CreateFormResponseService,
  ) {}

  @Post()
  @AuditLog('CRIAR FORM RESPONSE')
  @ApiOperation({ summary: 'Create form response' })
  create(
    @Req() req: any,
    @Body() createFormResponseDto: CreateFormResponseDto,
  ) {
    return this.createFormResponseService.execute({
      ...createFormResponseDto,
      createdBy: req.user.uuid,
    });
  }
}
