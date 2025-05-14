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
import { CreateReferralDto } from '../dto/create-referral.dto';
import { UpdateReferralDto } from '../dto/update-referral.dto';
import { CreateReferralService } from '../services/create-referral.service';
import { UpdateReferralService } from '../services/update-referral.service';
import { FindAllReferralsService } from '../services/find-all-referrals.service';
import { FindOneReferralService } from '../services/find-one-referral.service';
import { FindReferralsByPatientService } from '../services/find-referrals-by-patient.service';
import { FindReferralsByAttendanceService } from '../services/find-referrals-by-attendance.service';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';

@ApiTags('Encaminhamentos')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(
    private readonly createReferralService: CreateReferralService,
    private readonly updateReferralService: UpdateReferralService,
    private readonly findAllReferralsService: FindAllReferralsService,
    private readonly findOneReferralService: FindOneReferralService,
    private readonly findReferralsByPatientService: FindReferralsByPatientService,
    private readonly findReferralsByAttendanceService: FindReferralsByAttendanceService,
  ) {}

  @Post()
  @Permission(PermissionsEnum.create_referral)
  @ApiOperation({ summary: 'Criar um novo encaminhamento' })
  create(@Body() createReferralDto: CreateReferralDto) {
    return this.createReferralService.execute(createReferralDto);
  }

  @Get()
  @Permission(PermissionsEnum.read_referral)
  @ApiOperation({ summary: 'Listar todos os encaminhamentos' })
  findAll() {
    return this.findAllReferralsService.execute();
  }

  @Get('patient/:patientId')
  @Permission(PermissionsEnum.read_referral)
  @ApiOperation({ summary: 'Buscar encaminhamentos de um paciente' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.findReferralsByPatientService.execute(patientId);
  }

  @Get('attendance/:attendanceId')
  @Permission(PermissionsEnum.read_referral)
  @ApiOperation({ summary: 'Buscar encaminhamentos de um atendimento' })
  findByAttendance(@Param('attendanceId') attendanceId: string) {
    return this.findReferralsByAttendanceService.execute(attendanceId);
  }

  @Get(':id')
  @Permission(PermissionsEnum.read_referral)
  @ApiOperation({ summary: 'Buscar um encaminhamento pelo ID' })
  findOne(@Param('id') id: string) {
    return this.findOneReferralService.execute(id);
  }

  @Patch(':id')
  @Permission(PermissionsEnum.update_referral)
  @ApiOperation({ summary: 'Atualizar um encaminhamento' })
  update(
    @Param('id') id: string,
    @Body() updateReferralDto: UpdateReferralDto,
  ) {
    return this.updateReferralService.execute(id, updateReferralDto);
  }
}
