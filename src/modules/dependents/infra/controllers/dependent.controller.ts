import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditLog } from '@modules/audits/decorators';
import { CreateDependentDto } from '@modules/dependents/dto/createDependentDto';
import { CreateDependentService } from '@modules/dependents/services/create.dependent.service';
import { FindAllDependentService } from '@modules/dependents/services/findAll.dependent.service';
import { FindOneDependentService } from '@modules/dependents/services/findOne.dependent.service';
import { GetAllDependentDto } from '@modules/dependents/dto/getAllDependentDto';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';
import { Permission } from '@shared/decorators/Permission';
import { RemoveDependentService } from '@modules/dependents/services/remove.dependent.service';
import { UpdateDependentService } from '@modules/dependents/services/update.dependent.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

@ApiTags('dependents')
@Controller('dependents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class DependentController {
  constructor(
    private readonly createDependentService: CreateDependentService,
    private readonly findAllDependentService: FindAllDependentService,
    private readonly findOneDependentService: FindOneDependentService,
    private readonly updateDependentService: UpdateDependentService,
    private readonly removeDependentService: RemoveDependentService,
  ) {}

  @Post()
  @AuditLog('CRIAR DEPENDENTE')
  @ApiOperation({ summary: 'Create Dependent' })
  @Permission(ListOfPermissionsEnum.create_dependent)
  create(@Body() createDependentDto: CreateDependentDto) {
    return this.createDependentService.execute(createDependentDto);
  }

  @Get()
  @Permission(ListOfPermissionsEnum.find_all_dependents)
  findAll(@Query() query?: GetAllDependentDto) {
    return this.findAllDependentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Dependent' })
  @Permission(ListOfPermissionsEnum.find_one_dependent)
  findOne(@Param('id') id: string) {
    return this.findOneDependentService.findOne(id);
  }

  @AuditLog('ATUALIZAR DEPENDENTE')
  @Patch(':id')
  @Permission(ListOfPermissionsEnum.update_dependent)
  update(
    @Param('id') id: string,
    @Body() updateDependentDto: CreateDependentDto,
  ) {
    return this.updateDependentService.update(id, updateDependentDto);
  }

  @AuditLog('DELETAR DEPENDENTE')
  @Delete(':id')
  @Permission(ListOfPermissionsEnum.remove_dependent)
  remove(@Param('id') id: string) {
    return this.removeDependentService.remove(id);
  }
}
