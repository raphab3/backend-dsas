import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePersonSigDto } from '@modules/persosnSig/dto/create-personSig.dto';
import { CreatePersonSigService } from '@modules/persosnSig/services/create.personSig.service';
import { FindAllPersonSigService } from '@modules/persosnSig/services/findAll.personSig.service';
import { FindExternalSigpmpbService } from '@modules/persosnSig/services/findExternal.sigpmpb.service';
import { FindOnePersonSigService } from '@modules/persosnSig/services/findOne.personSig.service';
import { getPersonSigExternalDto } from '@modules/persosnSig/dto/get-personSigExternal.dto';
import { RemovePersonSigService } from '@modules/persosnSig/services/remove.personSig.service';
import { UpdatePersonSigDto } from '@modules/persosnSig/dto/update-personSig.dto';
import { UpdatePersonSigService } from '@modules/persosnSig/services/update.personSig.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetAllPersonSiglDto } from '@modules/persosnSig/dto/GetAllPersonSig.dto';
import { FindByMatriculaPersonSigService } from '@modules/persosnSig/services/FindByMatriculaPersonSig.service';
import { GetByMatriculaPersonSigDto } from '@modules/persosnSig/dto/GetByMatriculaPersonSigDto';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';

@ApiTags('personSig')
@Controller('persons-sig')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class PersonSigController {
  constructor(
    private readonly createPersonSigService: CreatePersonSigService,
    private readonly findAllPersonSigService: FindAllPersonSigService,
    private readonly findOnePersonSigService: FindOnePersonSigService,
    private readonly updatePersonSigService: UpdatePersonSigService,
    private readonly removePersonSigService: RemovePersonSigService,
    private readonly findExternalSigpmpbService: FindExternalSigpmpbService,
    private readonly findByMatriculaPersonSigService: FindByMatriculaPersonSigService,
  ) {}

  @AuditLog('CRIAR SERVIDOR SIGPMPB')
  @Post()
  @ApiOperation({ summary: 'Create PersonSig' })
  @HttpCode(201)
  @Permission(ListOfPermissionsEnum.create_personSig)
  create(@Body() createPersonSigDto: CreatePersonSigDto) {
    return this.createPersonSigService.execute(createPersonSigDto.matricula);
  }

  @Get()
  @ApiOperation({ summary: 'Find all PersonSig' })
  @Permission(ListOfPermissionsEnum.find_all_personSigs)
  findAll(@Query() query: GetAllPersonSiglDto) {
    return this.findAllPersonSigService.findAll(query);
  }

  @AuditLog('SYNC SERVIDOR SIGPMPB')
  @Post('external')
  @HttpCode(200)
  @ApiOperation({ summary: 'Find all PersonSig External' })
  @Permission(ListOfPermissionsEnum.find_external_personSigs)
  findAllExternal(@Body() body: getPersonSigExternalDto) {
    const matricula = body.matricula;
    return this.findExternalSigpmpbService.execute(matricula);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one PersonSig' })
  @Permission(ListOfPermissionsEnum.find_one_personSig)
  findOne(@Param('id') id: string) {
    return this.findOnePersonSigService.findOne(id);
  }

  @Get('matricula')
  @ApiOperation({ summary: 'Find PersonSig by matricula' })
  @Permission(ListOfPermissionsEnum.find_one_personSig)
  async findByMatricula(@Query() query: GetByMatriculaPersonSigDto) {
    return await this.findByMatriculaPersonSigService.execute(query.matricula);
  }

  @AuditLog('ATUALIZAR SERVIDOR SIGPMPB')
  @Patch(':id')
  @ApiOperation({ summary: 'Update PersonSig' })
  @Permission(ListOfPermissionsEnum.update_personSig)
  update(
    @Param('id') id: string,
    @Body() updatePersonSigDto: UpdatePersonSigDto,
  ) {
    return this.updatePersonSigService.update(id, updatePersonSigDto);
  }

  @AuditLog('REMOVER SERVIDOR SIGPMPB')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove PersonSig' })
  @Permission(ListOfPermissionsEnum.remove_personSig)
  remove(@Param('id') id: string) {
    return this.removePersonSigService.remove(id);
  }
}
