import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { MedicalRecordService } from '../services/medical-record.service';
import { UpdateMedicalRecordDto } from '../dto/update-medical-record.dto';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';
import { AnamnesisDto } from '../dto/create-medical-record.dto';

@ApiTags('Medical Records')
@Controller('medical-records')
@UseGuards(JwtAuthGuard)
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  @Permission(PermissionsEnum.create_attendance)
  @ApiOperation({
    summary:
      'Create a new medical record or update if one exists for the attendance',
  })
  create(@Body() createMedicalRecordDto: AnamnesisDto) {
    return this.medicalRecordService.create(createMedicalRecordDto);
  }

  @Get()
  @Permission(PermissionsEnum.find_all_attendances)
  @ApiOperation({ summary: 'Get all medical records' })
  findAll() {
    return this.medicalRecordService.findAll();
  }

  @Get(':id')
  @Permission(PermissionsEnum.find_one_attendance)
  @ApiOperation({ summary: 'Get a medical record by ID' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  findOne(@Param('id') id: string) {
    return this.medicalRecordService.findOne(id);
  }

  @Get('attendance/:attendanceId')
  @Permission(PermissionsEnum.find_one_attendance)
  @ApiOperation({ summary: 'Get a medical record by attendance ID' })
  @ApiParam({ name: 'attendanceId', description: 'Attendance ID' })
  async findByAttendance(@Param('attendanceId') attendanceId: string) {
    const medicalRecord =
      await this.medicalRecordService.findByAttendance(attendanceId);
    if (!medicalRecord) {
      return { exists: false, data: null };
    }
    return { exists: true, data: medicalRecord };
  }

  @Get('patient/:patientId')
  @Permission(PermissionsEnum.find_all_attendances)
  @ApiOperation({ summary: 'Get all medical records for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.medicalRecordService.findByPatient(patientId);
  }

  @Patch(':id')
  @Permission(PermissionsEnum.update_attendance)
  @ApiOperation({ summary: 'Update a medical record' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordService.update(id, updateMedicalRecordDto);
  }

  @Delete(':id')
  @Permission(PermissionsEnum.remove_attendance)
  @ApiOperation({ summary: 'Delete a medical record' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  remove(@Param('id') id: string) {
    return this.medicalRecordService.remove(id);
  }
}
