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
import { CreateAssetDto } from '@modules/assets/dto/CreateAssetDto';
import { UpdateAssetDto } from '@modules/assets/dto/UpdateInventaryDto';
import { CreateAssetService } from '@modules/assets/services/create.Asset.service';
import { FindAllAssetService } from '@modules/assets/services/findAll.Asset.service';
import { FindOneAssetService } from '@modules/assets/services/findOne.Asset.service';
import { RemoveAssetService } from '@modules/assets/services/remove.Asset.service';
import { UpdateAssetService } from '@modules/assets/services/update.Asset.service';

@ApiTags('assets')
@Controller('assets')
export class AssetController {
  constructor(
    private readonly createAssetService: CreateAssetService,
    private readonly findAllAssetService: FindAllAssetService,
    private readonly findOneAssetService: FindOneAssetService,
    private readonly updateAssetService: UpdateAssetService,
    private readonly removeAssetService: RemoveAssetService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Asset' })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.createAssetService.execute(createAssetDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllAssetService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Asset' })
  findOne(@Param('id') id: string) {
    return this.findOneAssetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.updateAssetService.update(id, updateAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeAssetService.remove(id);
  }
}
