import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MedicationService } from '../services/medication.service';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
} from '../dto/medication.dto';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { Permission } from '@shared/decorators/Permission';

@ApiTags('Patient Medications')
@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  @Permission(PermissionsEnum.create_patient_health_info)
  @ApiOperation({ summary: 'Create a new medication record' })
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationService.create(createMedicationDto);
  }

  @Get()
  @Permission(PermissionsEnum.find_all_patient_health_info)
  @ApiOperation({ summary: 'Get all medication records' })
  findAll() {
    return this.medicationService.findAll();
  }

  @Get('patient/:patientId')
  @Permission(PermissionsEnum.find_all_patient_health_info)
  @ApiOperation({ summary: 'Get all medications for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  findByPatient(
    @Param('patientId') patientId: string,
    @Query('active') active?: boolean,
  ) {
    if (active === true) {
      return this.medicationService.findActiveByPatient(patientId);
    }
    return this.medicationService.findByPatient(patientId);
  }

  @Get(':id')
  @Permission(PermissionsEnum.find_one_patient_health_info)
  @ApiOperation({ summary: 'Get a medication record by ID' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  findOne(@Param('id') id: string) {
    return this.medicationService.findOne(id);
  }

  @Patch(':id')
  @Permission(PermissionsEnum.update_patient_health_info)
  @ApiOperation({ summary: 'Update a medication record' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    return this.medicationService.update(id, updateMedicationDto);
  }

  @Patch(':id/deactivate')
  @Permission(PermissionsEnum.update_patient_health_info)
  @ApiOperation({ summary: 'Deactivate a medication record' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  deactivate(@Param('id') id: string) {
    return this.medicationService.deactivate(id);
  }

  @Delete(':id')
  @Permission(PermissionsEnum.remove_patient_health_info)
  @ApiOperation({ summary: 'Delete a medication record' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  remove(@Param('id') id: string) {
    return this.medicationService.remove(id);
  }
}
