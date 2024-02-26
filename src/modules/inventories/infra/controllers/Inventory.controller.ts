import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditLog } from '@modules/audits/decorators';
import { CreateInventaryDto } from '@modules/inventories/dto/CreateInventaryDto';
import { CreateInventoryService } from '@modules/inventories/services/create.Inventory.service';
import { FindAllInventoryService } from '@modules/inventories/services/findAll.Inventory.service';
import { FindOneInventoryService } from '@modules/inventories/services/findOne.Inventory.service';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';
import { Permission } from '@shared/decorators/Permission';
import { RemoveInventoryService } from '@modules/inventories/services/remove.Inventory.service';
import { UpdateInventaryDto } from '@modules/inventories/dto/UpdateInventaryDto';
import { UpdateInventoryService } from '@modules/inventories/services/update.Inventory.service';
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

@ApiTags('inventories')
@Controller('inventories')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class InventoryController {
  constructor(
    private readonly createInventoryService: CreateInventoryService,
    private readonly findAllInventaryService: FindAllInventoryService,
    private readonly findOneInventaryService: FindOneInventoryService,
    private readonly updateInventaryService: UpdateInventoryService,
    private readonly removeInventaryService: RemoveInventoryService,
  ) {}

  @AuditLog('CRIAR INVENTARIO')
  @Post()
  @ApiOperation({ summary: 'Create Inventory' })
  @Permission(ListOfPermissionsEnum.create_inventory)
  create(@Body() createInventaryDto: CreateInventaryDto) {
    return this.createInventoryService.execute(createInventaryDto);
  }

  @Get()
  @Permission(ListOfPermissionsEnum.find_all_inventories)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllInventaryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Inventory' })
  @Permission(ListOfPermissionsEnum.find_one_inventory)
  findOne(@Param('id') id: string) {
    return this.findOneInventaryService.findOne(id);
  }

  @AuditLog('ATUALIZAR INVENTARIO')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Inventory' })
  @Permission(ListOfPermissionsEnum.update_inventory)
  update(
    @Param('id') id: string,
    @Body() updateInventaryDto: UpdateInventaryDto,
  ) {
    return this.updateInventaryService.update(id, updateInventaryDto);
  }

  @AuditLog('REMOVER INVENTARIO')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Inventory' })
  @Permission(ListOfPermissionsEnum.remove_inventory)
  remove(@Param('id') id: string) {
    return this.removeInventaryService.remove(id);
  }
}
