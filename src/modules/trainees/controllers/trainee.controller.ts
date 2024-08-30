import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTraineeDto } from '@modules/trainees/dto/create-trainee.dto';
import { CreateTraineeService } from '@modules/trainees/services/create.trainee.service';
import { FindAllTraineeService } from '@modules/trainees/services/findAll.trainee.service';
import { FindOneTraineeService } from '@modules/trainees/services/findOne.trainee.service';
import { RemoveTraineeService } from '@modules/trainees/services/remove.trainee.service';
import { UpdateTraineeDto } from '@modules/trainees/dto/update-trainee.dto';
import { UpdateTraineeService } from '@modules/trainees/services/update.trainee.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/Jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { QueryTraineeDto } from '../dto/query-trainee.dto';

@ApiTags('trainees')
@Controller('trainees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class TraineeController {
  constructor(
    private readonly createTraineeService: CreateTraineeService,
    private readonly findAllTraineeService: FindAllTraineeService,
    private readonly findOneTraineeService: FindOneTraineeService,
    private readonly updateTraineeService: UpdateTraineeService,
    private readonly removeTraineeService: RemoveTraineeService,
  ) {}

  @Post()
  @AuditLog('CRIAR TEMPLATE')
  @ApiOperation({ summary: 'Create Trainee' })
  @Permission(PermissionsEnum.create_trainee)
  create(@Body() createTraineeDto: CreateTraineeDto) {
    return this.createTraineeService.execute(createTraineeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all Trainee' })
  @Permission(PermissionsEnum.find_all_trainees)
  findAll(@Query() query: QueryTraineeDto) {
    return this.findAllTraineeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one Trainee' })
  @Permission(PermissionsEnum.find_one_trainee)
  findOne(@Param('id') id: string) {
    return this.findOneTraineeService.findOne(id);
  }

  @Patch(':id')
  @AuditLog('ATUALIZAR TEMPLATE')
  @ApiOperation({ summary: 'Update Trainee' })
  @Permission(PermissionsEnum.update_trainee)
  update(@Param('id') id: string, @Body() updateTraineeDto: UpdateTraineeDto) {
    return this.updateTraineeService.update(id, updateTraineeDto);
  }

  @Delete(':id')
  @AuditLog('REMOVER TEMPLATE')
  @ApiOperation({ summary: 'Remove Trainee' })
  @Permission(PermissionsEnum.remove_trainee)
  remove(@Param('id') id: string) {
    return this.removeTraineeService.remove(id);
  }
}
