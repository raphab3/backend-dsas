import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSpecialtieservice } from '@modules/specialties/services/create.Specialty.service';
import { CreateSpecialtyDto } from '@modules/specialties/dto/create-Specialty.dto';
import { FindAllSpecialtieservice } from '@modules/specialties/services/findAll.Specialty.service';
import { FindOneSpecialtieservice } from '@modules/specialties/services/findOne.Specialty.service';
import { RemoveSpecialtieservice } from '@modules/specialties/services/remove.Specialty.service';
import { UpdateSpecialtieservice } from '@modules/specialties/services/update.Specialty.service';
import { UpdateSpecialtyDto } from '@modules/specialties/dto/update-Specialty.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';

@ApiTags('specialties')
@Controller('specialties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class SpecialtyController {
  constructor(
    private readonly createSpecialtieservice: CreateSpecialtieservice,
    private readonly findAllSpecialtieservice: FindAllSpecialtieservice,
    private readonly findOneSpecialtieservice: FindOneSpecialtieservice,
    private readonly updateSpecialtieservice: UpdateSpecialtieservice,
    private readonly removeSpecialtieservice: RemoveSpecialtieservice,
  ) {}

  @AuditLog('CRIAR ESPECIALIDADE')
  @Post()
  @ApiOperation({ summary: 'Create Specialty' })
  @Permission(ListOfPermissionsEnum.create_specialty)
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.createSpecialtieservice.execute(createSpecialtyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Specialty' })
  @Permission(ListOfPermissionsEnum.find_all_specialties)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllSpecialtieservice.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Specialty' })
  @Permission(ListOfPermissionsEnum.find_one_specialty)
  findOne(@Param('id') id: string) {
    return this.findOneSpecialtieservice.findOne(id);
  }

  @AuditLog('ATUALIZAR ESPECIALIDADE')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Specialty' })
  @Permission(ListOfPermissionsEnum.update_specialty)
  update(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ) {
    return this.updateSpecialtieservice.update(id, updateSpecialtyDto);
  }

  @AuditLog('REMOVER ESPECIALIDADE')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Specialty' })
  @Permission(ListOfPermissionsEnum.remove_specialty)
  remove(@Param('id') id: string) {
    return this.removeSpecialtieservice.remove(id);
  }
}
