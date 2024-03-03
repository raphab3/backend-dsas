import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from '@modules/locations/dto/create-location.dto';
import { CreateLocationService } from '@modules/locations/services/create.location.service';
import { FindAllLocationService } from '@modules/locations/services/findAll.location.service';
import { FindOneLocationService } from '@modules/locations/services/findOne.location.service';
import { RemoveLocationService } from '@modules/locations/services/remove.location.service';
import { UpdateLocationDto } from '@modules/locations/dto/update-location.dto';
import { UpdateLocationService } from '@modules/locations/services/update.location.service';
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
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { LocationCityEnum } from '@modules/locations/interfaces/ILocation';

@ApiTags('locations')
@Controller('locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class LocationController {
  constructor(
    private readonly createLocationService: CreateLocationService,
    private readonly findAllLocationService: FindAllLocationService,
    private readonly findOneLocationService: FindOneLocationService,
    private readonly updateLocationService: UpdateLocationService,
    private readonly removeLocationService: RemoveLocationService,
  ) {}

  @Post()
  @AuditLog('CRIAR TEMPLATE')
  @ApiOperation({ summary: 'Create Location' })
  @Permission(PermissionsEnum.create_location)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.createLocationService.execute({
      name: createLocationDto.name,
      description: createLocationDto.description,
      city: createLocationDto.city as LocationCityEnum,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Find all Location' })
  @Permission(PermissionsEnum.find_all_locations)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllLocationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Location' })
  @Permission(PermissionsEnum.find_one_location)
  findOne(@Param('id') id: string) {
    return this.findOneLocationService.findOne(id);
  }

  @Patch(':id')
  @AuditLog('ATUALIZAR TEMPLATE')
  @ApiOperation({ summary: 'Update Location' })
  @Permission(PermissionsEnum.update_location)
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.updateLocationService.update(id, {
      name: updateLocationDto.name,
      description: updateLocationDto.description,
      city: updateLocationDto.city as LocationCityEnum,
    });
  }

  @Delete(':id')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove Location' })
  @Permission(PermissionsEnum.remove_location)
  remove(@Param('id') id: string) {
    return this.removeLocationService.remove(id);
  }
}
