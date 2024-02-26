import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditLog } from '@modules/audits/decorators';
import { CreateAssetDto } from '@modules/assets/dto/CreateAssetDto';
import { CreateAssetService } from '@modules/assets/services/create.Asset.service';
import { FindAllAssetService } from '@modules/assets/services/findAll.Asset.service';
import { FindOneAssetService } from '@modules/assets/services/findOne.Asset.service';
import { RemoveAssetService } from '@modules/assets/services/remove.Asset.service';
import { UpdateAssetDto } from '@modules/assets/dto/UpdateInventaryDto';
import { UpdateAssetService } from '@modules/assets/services/update.Asset.service';
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
import { Permission } from '@shared/decorators/Permission';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';

@ApiTags('assets')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class AssetController {
  constructor(
    private readonly createAssetService: CreateAssetService,
    private readonly findAllAssetService: FindAllAssetService,
    private readonly findOneAssetService: FindOneAssetService,
    private readonly updateAssetService: UpdateAssetService,
    private readonly removeAssetService: RemoveAssetService,
  ) {}

  @AuditLog('CRIAR PATRIMONIO')
  @Post()
  @ApiOperation({ summary: 'Create Asset' })
  @Permission(ListOfPermissionsEnum.create_asset)
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.createAssetService.execute(createAssetDto);
  }

  @Get()
  @Permission(ListOfPermissionsEnum.find_all_assets)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllAssetService.findAll(query);
  }

  @Get(':id')
  @Permission(ListOfPermissionsEnum.find_one_asset)
  @ApiOperation({ summary: 'Find one Asset' })
  findOne(@Param('id') id: string) {
    return this.findOneAssetService.findOne(id);
  }

  @AuditLog('ATUALIZAR PATRIMONIO')
  @Patch(':id')
  @Permission(ListOfPermissionsEnum.update_asset)
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.updateAssetService.update(id, updateAssetDto);
  }

  @AuditLog('REMOVER PATRIMONIO')
  @Delete(':id')
  @Permission(ListOfPermissionsEnum.remove_asset)
  remove(@Param('id') id: string) {
    return this.removeAssetService.remove(id);
  }
}
