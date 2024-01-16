import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CreatePersonSigDto } from '@modules/persosnSig/dto/create-personSig.dto';
import { UpdatePersonSigDto } from '@modules/persosnSig/dto/update-personSig.dto';
import { CreatePersonSigService } from '@modules/persosnSig/services/create.personSig.service';
import { FindAllPersonSigService } from '@modules/persosnSig/services/findAll.personSig.service';
import { FindOnePersonSigService } from '@modules/persosnSig/services/findOne.personSig.service';
import { RemovePersonSigService } from '@modules/persosnSig/services/remove.personSig.service';
import { UpdatePersonSigService } from '@modules/persosnSig/services/update.personSig.service';
import { getPersonSigExternalDto } from '@modules/persosnSig/dto/get-personSigExternal.dto';
import { FindExternalSigpmpbService } from '@modules/persosnSig/services/findExternal.sigpmpb.service';

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
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create PersonSig' })
  create(@Body() createPersonSigDto: CreatePersonSigDto) {
    return this.createPersonSigService.execute(createPersonSigDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllPersonSigService.findAll(query);
  }

  @Post('external')
  findAllExternal(@Body() body: getPersonSigExternalDto) {
    const matricula = body.matricula;
    return this.findExternalSigpmpbService.execute(matricula);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one PersonSig' })
  findOne(@Param('id') id: string) {
    return this.findOnePersonSigService.findOne(id);
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
