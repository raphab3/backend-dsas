import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChronicConditionService } from '../services/chronic-condition.service';
import { CreateChronicConditionDto } from '../dto/create-chronic-condition.dto';
import { UpdateChronicConditionDto } from '../dto/update-chronic-condition.dto';

@ApiTags('Patient Chronic Conditions')
@Controller('patient-chronic-conditions')
export class ChronicConditionController {
  constructor(private readonly chronicConditionService: ChronicConditionService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova condição crônica' })
  create(@Body() createConditionDto: CreateChronicConditionDto) {
    return this.chronicConditionService.create(createConditionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as condições crônicas ou filtrar por paciente' })
  findAll(@Query('patientId') patientId?: string) {
    if (patientId) {
      return this.chronicConditionService.findByPatient(patientId);
    }
    return this.chronicConditionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma condição crônica pelo ID' })
  findOne(@Param('id') id: string) {
    return this.chronicConditionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma condição crônica' })
  update(@Param('id') id: string, @Body() updateConditionDto: UpdateChronicConditionDto) {
    return this.chronicConditionService.update(id, updateConditionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma condição crônica' })
  remove(@Param('id') id: string) {
    return this.chronicConditionService.remove(id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Marcar uma condição crônica como resolvida' })
  resolve(@Param('id') id: string) {
    return this.chronicConditionService.markAsResolved(id);
  }
}
