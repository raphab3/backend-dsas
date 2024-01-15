import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
} from '@nestjs/common';

@ApiTags('professionals')
@Controller('professionals')
export class ProfessionalController {
  constructor(
    private readonly createProfessionalService: CreateProfessionalService,
    private readonly findAllProfessionalService: FindAllProfessionalService,
    private readonly findOneProfessionalService: FindOneProfessionalService,
    private readonly updateProfessionalService: UpdateProfessionalService,
    private readonly removeProfessionalService: RemoveProfessionalService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Professional' })
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.createProfessionalService.execute(createProfessionalDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllProfessionalService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Professional' })
  findOne(@Param('id') id: string) {
    return this.findOneProfessionalService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
  ) {
    return this.updateProfessionalService.update(id, updateProfessionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeProfessionalService.remove(id);
  }
}
