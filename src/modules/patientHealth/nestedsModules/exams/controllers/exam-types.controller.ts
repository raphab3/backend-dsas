import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateExamTypeDto } from '../dto/create-exam-type.dto';
import { UpdateExamTypeDto } from '../dto/update-exam-type.dto';
import { CreateExamTypeService } from '../services/create-exam-type.service';
import { UpdateExamTypeService } from '../services/update-exam-type.service';
import { FindAllExamTypesService } from '../services/find-all-exam-types.service';
import { FindOneExamTypeService } from '../services/find-one-exam-type.service';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';

@ApiTags('Tipos de Exames')
@Controller('exam-types')
@UseGuards(JwtAuthGuard)
export class ExamTypesController {
  constructor(
    private readonly createExamTypeService: CreateExamTypeService,
    private readonly updateExamTypeService: UpdateExamTypeService,
    private readonly findAllExamTypesService: FindAllExamTypesService,
    private readonly findOneExamTypeService: FindOneExamTypeService,
  ) {}

  @Post()
  @Permission(PermissionsEnum.create_exam_type)
  @ApiOperation({ summary: 'Criar um novo tipo de exame' })
  create(@Body() createExamTypeDto: CreateExamTypeDto) {
    return this.createExamTypeService.execute(createExamTypeDto);
  }

  @Get()
  @Permission(PermissionsEnum.read_exam_type)
  @ApiOperation({ summary: 'Listar todos os tipos de exames' })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Filtrar apenas tipos de exame ativos',
  })
  findAll(@Query('activeOnly') activeOnly: boolean) {
    return this.findAllExamTypesService.execute(activeOnly);
  }

  @Get(':id')
  @Permission(PermissionsEnum.read_exam_type)
  @ApiOperation({ summary: 'Buscar um tipo de exame pelo ID' })
  findOne(@Param('id') id: string) {
    return this.findOneExamTypeService.execute(id);
  }

  @Patch(':id')
  @Permission(PermissionsEnum.update_exam_type)
  @ApiOperation({ summary: 'Atualizar um tipo de exame' })
  update(
    @Param('id') id: string,
    @Body() updateExamTypeDto: UpdateExamTypeDto,
  ) {
    return this.updateExamTypeService.execute(id, updateExamTypeDto);
  }
}
