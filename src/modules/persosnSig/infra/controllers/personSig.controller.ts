import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
} from '@nestjs/common';
import { GetAllPersonSiglDto } from '@modules/persosnSig/dto/GetAllPersonSig.dto';
import { FindByMatriculaPersonSigService } from '@modules/persosnSig/services/FindByMatriculaPersonSig.service';
import { GetByMatriculaPersonSigDto } from '@modules/persosnSig/dto/GetByMatriculaPersonSigDto';

@ApiTags('personSig')
@Controller('persons-sig')
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

  @Post()
  @ApiOperation({ summary: 'Create PersonSig' })
  create(@Body() createPersonSigDto: CreatePersonSigDto) {
    return this.createPersonSigService.execute(createPersonSigDto.matricula);
  }

  @Get()
  @ApiOperation({ summary: 'Find all PersonSig' })
  findAll(@Query() query: GetAllPersonSiglDto) {
    return this.findAllPersonSigService.findAll(query);
  }

  @Post('external')
  @HttpCode(200)
  findAllExternal(@Body() body: getPersonSigExternalDto) {
    const matricula = body.matricula;
    return this.findExternalSigpmpbService.execute(matricula);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one PersonSig' })
  findOne(@Param('id') id: string) {
    return this.findOnePersonSigService.findOne(id);
  }

  @Get('matricula')
  @ApiOperation({ summary: 'Find PersonSig by matricula' })
  async findByMatricula(@Query() query: GetByMatriculaPersonSigDto) {
    return await this.findByMatriculaPersonSigService.execute(query.matricula);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonSigDto: UpdatePersonSigDto,
  ) {
    return this.updatePersonSigService.update(id, updatePersonSigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removePersonSigService.remove(id);
  }
}
