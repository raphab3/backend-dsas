import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Body,
  UseGuards,
  UseInterceptors,
  Post,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { CreateFormResponseService } from '../services/create.formResponse.service';
import { CreateFormResponseDto } from '../dto/create-form_response.dto';
import { GetFormResponseByIdService } from '../services/GetFormResponseById.service';
import { UpdateFormResponseService } from '../services/update.formResponse.service';
import { DeleteFormResponseService } from '../services/delete.formResponse.service';
import { GenerateFormResultService } from '../services/GenerateFormResult.service';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('forms-responses')
@Controller('forms-responses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class FormResponseController {
  constructor(
    private readonly createFormResponseService: CreateFormResponseService,
    private readonly getFormResponseByIdService: GetFormResponseByIdService,
    private readonly updateFormResponseService: UpdateFormResponseService,
    private readonly deleteFormResponseService: DeleteFormResponseService,
    private readonly generateFormResultService: GenerateFormResultService,
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

  @Get(':id')
  @ApiOperation({ summary: 'Find form response by id' })
  findById(@Param('id') id: string) {
    return this.getFormResponseByIdService.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update form response by id' })
  update(
    @Param('id') id: string,
    @Body()
    updateData: {
      fieldUpdates: { fieldId: string; value: any; content?: string }[];
    },
  ) {
    return this.updateFormResponseService.execute(id, updateData);
  }

  @Delete(':id')
  @AuditLog('DELETAR FORM RESPONSE')
  @ApiOperation({ summary: 'Delete form response by id' })
  delete(@Param('id') id: string) {
    return this.deleteFormResponseService.execute(id);
  }

  @Get(':id/generate-result')
  @ApiOperation({ summary: 'Generate form response result' })
  generateResult(@Param('id') id: string) {
    return this.generateFormResultService.execute(id);
  }
}
