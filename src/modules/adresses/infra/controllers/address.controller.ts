import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAddressDto } from '@modules/adresses/dto/create-address.dto';
import { CreateAddressService } from '@modules/adresses/services/create.address.service';
import { FindAllAddressService } from '@modules/adresses/services/findAll.address.service';
import { FindOneAddressService } from '@modules/adresses/services/findOne.address.service';
import { RemoveAddressService } from '@modules/adresses/services/remove.address.service';
import { UpdateAddressDto } from '@modules/adresses/dto/update-address.dto';
import { UpdateAddressService } from '@modules/adresses/services/update.address.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@ApiTags('address')
@Controller('address')
export class AddressController {
  constructor(
    private readonly createAddressService: CreateAddressService,
    private readonly findAllAddressService: FindAllAddressService,
    private readonly findOneAddressService: FindOneAddressService,
    private readonly updateAddressService: UpdateAddressService,
    private readonly removeAddressService: RemoveAddressService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Address' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createAddressDto: CreateAddressDto) {
    const { name } = createAddressDto;

    return this.createAddressService.execute({
      name,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Find all Address' })
  async findAll() {
    const adresses = await this.findAllAddressService.execute();
    return adresses;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Address' })
  findOne(@Param('id') id: string) {
    return this.findOneAddressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.updateAddressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeAddressService.remove(+id);
  }
}
