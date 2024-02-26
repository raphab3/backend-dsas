import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProfessionalDto } from '@modules/professionals/dto/create-professional.dto';
import { CreateProfessionalService } from '@modules/professionals/services/create.professional.service';
import { FindAllProfessionalService } from '@modules/professionals/services/findAll.professional.service';
import { FindOneProfessionalService } from '@modules/professionals/services/findOne.professional.service';
import { RemoveProfessionalService } from '@modules/professionals/services/remove.professional.service';
import { UpdateProfessionalDto } from '@modules/professionals/dto/update-professional.dto';
import { UpdateProfessionalService } from '@modules/professionals/services/update.professional.service';
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

@ApiTags('professionals')
@Controller('professionals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class ProfessionalController {
  constructor(
    private readonly createProfessionalService: CreateProfessionalService,
    private readonly findAllProfessionalService: FindAllProfessionalService,
    private readonly findOneProfessionalService: FindOneProfessionalService,
    private readonly updateProfessionalService: UpdateProfessionalService,
    private readonly removeProfessionalService: RemoveProfessionalService,
  ) {}

  @AuditLog('CRIAR PROFISSIONAL')
  @Post()
  @ApiOperation({ summary: 'Create Professional' })
  @Permission(ListOfPermissionsEnum.cretae_professional)
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.createProfessionalService.execute(createProfessionalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Professional' })
  @Permission(ListOfPermissionsEnum.find_all_professionals)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllProfessionalService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Professional' })
  @Permission(ListOfPermissionsEnum.find_one_professional)
  findOne(@Param('id') id: string) {
    return this.findOneProfessionalService.findOne(id);
  }

  @AuditLog('ATUALIZAR PROFISSIONAL')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Professional' })
  @Permission(ListOfPermissionsEnum.update_professional)
  update(
    @Param('id') id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
  ) {
    return this.updateProfessionalService.update(id, updateProfessionalDto);
  }

  @AuditLog('REMOVER PROFISSIONAL')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Professional' })
  @Permission(ListOfPermissionsEnum.remove_professional)
  remove(@Param('id') id: string) {
    return this.removeProfessionalService.remove(id);
  }
}
