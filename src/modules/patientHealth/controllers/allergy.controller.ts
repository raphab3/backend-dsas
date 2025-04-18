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
import { AllergyService } from '../services/allergy.service';
import { CreateAllergyDto } from '../dto/create-allergy.dto';
import { UpdateAllergyDto } from '../dto/update-allergy.dto';

@ApiTags('Patient Allergies')
@Controller('patient-allergies')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova alergia' })
  create(@Body() createAllergyDto: CreateAllergyDto) {
    return this.allergyService.create(createAllergyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as alergias ou filtrar por paciente' })
  findAll(@Query('patientId') patientId?: string) {
    if (patientId) {
      return this.allergyService.findByPatient(patientId);
    }
    return this.allergyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma alergia pelo ID' })
  findOne(@Param('id') id: string) {
    return this.allergyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma alergia' })
  update(@Param('id') id: string, @Body() updateAllergyDto: UpdateAllergyDto) {
    return this.allergyService.update(id, updateAllergyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma alergia' })
  remove(@Param('id') id: string) {
    return this.allergyService.remove(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativar uma alergia' })
  deactivate(@Param('id') id: string) {
    return this.allergyService.deactivate(id);
  }
}
