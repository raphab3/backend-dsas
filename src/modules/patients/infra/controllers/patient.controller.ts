import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { CreatePatientService } from '@modules/patients/services/create.patient.service';
import { FindAllPatientService } from '@modules/patients/services/findAll.patient.service';
import { FindOnePatientService } from '@modules/patients/services/findOne.patient.service';
import { RemovePatientService } from '@modules/patients/services/remove.patient.service';
import { UpdatePatientDto } from '@modules/patients/dto/update-patient.dto';
import { UpdatePatientService } from '@modules/patients/services/update.patient.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@ApiTags('patient')
@Controller('patient')
export class PatientController {
  constructor(
    private readonly createPatientService: CreatePatientService,
    private readonly findAllPatientService: FindAllPatientService,
    private readonly findOnePatientService: FindOnePatientService,
    private readonly updatePatientService: UpdatePatientService,
    private readonly removePatientService: RemovePatientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Patient' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.createPatientService.execute(createPatientDto);
  }

  @Get()
  findAll() {
    return this.findAllPatientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Patient' })
  findOne(@Param('id') id: string) {
    return this.findOnePatientService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.updatePatientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removePatientService.remove(id);
  }
}
