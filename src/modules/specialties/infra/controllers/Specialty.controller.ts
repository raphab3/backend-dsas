import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
} from '@nestjs/common';

@ApiTags('specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(
    private readonly createSpecialtieservice: CreateSpecialtieservice,
    private readonly findAllSpecialtieservice: FindAllSpecialtieservice,
    private readonly findOneSpecialtieservice: FindOneSpecialtieservice,
    private readonly updateSpecialtieservice: UpdateSpecialtieservice,
    private readonly removeSpecialtieservice: RemoveSpecialtieservice,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Specialty' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.createSpecialtieservice.execute(createSpecialtyDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllSpecialtieservice.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Specialty' })
  findOne(@Param('id') id: string) {
    return this.findOneSpecialtieservice.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ) {
    return this.updateSpecialtieservice.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeSpecialtieservice.remove(id);
  }
}