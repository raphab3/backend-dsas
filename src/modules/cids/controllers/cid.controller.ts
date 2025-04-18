import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { CreateCidService } from '../services/create-cid.service';
import { FindAllCidsService } from '../services/find-all-cids.service';
import { FindOneCidService } from '../services/find-one-cid.service';
import { ImportCidsService } from '../services/import-cids.service';
import { CreateCidDto } from '../dto/create-cid.dto';
import { QueryCidDto } from '../dto/query-cid.dto';
import { Public } from '@shared/decorators';

@ApiTags('cids')
@Controller('cids')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
@Public()
export class CidController {
  constructor(
    private readonly createCidService: CreateCidService,
    private readonly findAllCidsService: FindAllCidsService,
    private readonly findOneCidService: FindOneCidService,
    private readonly importCidsService: ImportCidsService,
  ) {}

  @Post()
  @AuditLog('CRIAR CID')
  @ApiOperation({ summary: 'Create CID' })
  @Permission(PermissionsEnum.create_cid)
  create(@Body() createCidDto: CreateCidDto) {
    return this.createCidService.execute(createCidDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all CIDs' })
  findAll(@Query() query: QueryCidDto) {
    return this.findAllCidsService.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one CID by ID' })
  findOne(@Param('id') id: string) {
    return this.findOneCidService.execute(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Find one CID by code' })
  findByCode(@Param('code') code: string) {
    return this.findOneCidService.findByCode(code);
  }

  @Post('import')
  @AuditLog('IMPORTAR CIDs')
  @ApiOperation({ summary: 'Import CIDs from CSV files' })
  async importCids() {
    await this.importCidsService.execute();
    return { message: 'CIDs imported successfully' };
  }
}
