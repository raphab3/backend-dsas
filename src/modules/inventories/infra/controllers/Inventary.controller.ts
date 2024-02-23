import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { CreateInventaryService } from '@modules/inventories/services/create.Inventary.service';
import { FindAllInventaryService } from '@modules/inventories/services/findAll.Inventary.service';
import { FindOneInventaryService } from '@modules/inventories/services/findOne.Inventary.service';
import { RemoveInventaryService } from '@modules/inventories/services/remove.Inventary.service';
import { UpdateInventaryService } from '@modules/inventories/services/update.Inventary.service';
import { CreateInventaryDto } from '@modules/inventories/dto/CreateInventaryDto';
import { UpdateInventaryDto } from '@modules/inventories/dto/UpdateInventaryDto';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@ApiTags('inventories')
@Controller('inventories')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class InventaryController {
  constructor(
    private readonly createInventaryService: CreateInventaryService,
    private readonly findAllInventaryService: FindAllInventaryService,
    private readonly findOneInventaryService: FindOneInventaryService,
    private readonly updateInventaryService: UpdateInventaryService,
    private readonly removeInventaryService: RemoveInventaryService,
  ) {}

  @AuditLog('CRIAR INVENTARIO')
  @Post()
  @ApiOperation({ summary: 'Create Inventary' })
  create(@Body() createInventaryDto: CreateInventaryDto) {
    return this.createInventaryService.execute(createInventaryDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllInventaryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Inventary' })
  findOne(@Param('id') id: string) {
    return this.findOneInventaryService.findOne(id);
  }

  @AuditLog('ATUALIZAR INVENTARIO')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventaryDto: UpdateInventaryDto,
  ) {
    return this.updateInventaryService.update(id, updateInventaryDto);
  }

  @AuditLog('REMOVER INVENTARIO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeInventaryService.remove(id);
  }
}
