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

@ApiTags('personSig')
@Controller('personSig')
export class PersonSigController {
  constructor(
    private readonly createPersonSigService: CreatePersonSigService,
    private readonly findAllPersonSigService: FindAllPersonSigService,
    private readonly findOnePersonSigService: FindOnePersonSigService,
    private readonly updatePersonSigService: UpdatePersonSigService,
    private readonly removePersonSigService: RemovePersonSigService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create PersonSig' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createPersonSigDto: CreatePersonSigDto) {
    return this.createPersonSigService.execute(createPersonSigDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllPersonSigService.findAll(query);
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
