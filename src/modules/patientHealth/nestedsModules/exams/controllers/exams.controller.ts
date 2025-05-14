import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { CreateExamService } from '../services/create-exam.service';
import { UpdateExamService } from '../services/update-exam.service';
import { FindAllExamsService } from '../services/find-all-exams.service';
import { FindOneExamService } from '../services/find-one-exam.service';
import { FindExamsByPatientService } from '../services/find-exams-by-patient.service';
import { FindExamsByAttendanceService } from '../services/find-exams-by-attendance.service';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';

@ApiTags('Exames')
@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(
    private readonly createExamService: CreateExamService,
    private readonly updateExamService: UpdateExamService,
    private readonly findAllExamsService: FindAllExamsService,
    private readonly findOneExamService: FindOneExamService,
    private readonly findExamsByPatientService: FindExamsByPatientService,
    private readonly findExamsByAttendanceService: FindExamsByAttendanceService,
  ) {}

  @Post()
  @Permission(PermissionsEnum.create_exam)
  @ApiOperation({ summary: 'Criar um novo exame' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.createExamService.execute(createExamDto);
  }

  @Get()
  @Permission(PermissionsEnum.read_exam)
  @ApiOperation({ summary: 'Listar todos os exames' })
  findAll() {
    return this.findAllExamsService.execute();
  }

  @Get('patient/:patientId')
  @Permission(PermissionsEnum.read_exam)
  @ApiOperation({ summary: 'Buscar exames de um paciente' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.findExamsByPatientService.execute(patientId);
  }

  @Get('attendance/:attendanceId')
  @Permission(PermissionsEnum.read_exam)
  @ApiOperation({ summary: 'Buscar exames de um atendimento' })
  findByAttendance(@Param('attendanceId') attendanceId: string) {
    return this.findExamsByAttendanceService.execute(attendanceId);
  }

  @Get(':id')
  @Permission(PermissionsEnum.read_exam)
  @ApiOperation({ summary: 'Buscar um exame pelo ID' })
  findOne(@Param('id') id: string) {
    return this.findOneExamService.execute(id);
  }

  @Patch(':id')
  @Permission(PermissionsEnum.update_exam)
  @ApiOperation({ summary: 'Atualizar um exame' })
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.updateExamService.execute(id, updateExamDto);
  }
}
