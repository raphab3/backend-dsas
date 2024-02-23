import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { CreateUsersService } from '@modules/users/services/create.users.service';
import { FindAllUsersService } from '@modules/users/services/findAll.users.service';
import { FindOneUsersService } from '@modules/users/services/findOne.users.service';
import { RemoveUsersService } from '@modules/users/services/remove.users.service';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { UpdateUsersService } from '@modules/users/services/update.users.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Catch,
  HttpException,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';

@Catch(HttpException)
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
export class UsersController {
  constructor(
    private readonly createUsersService: CreateUsersService,
    private readonly findAllUsersService: FindAllUsersService,
    private readonly findOneUsersService: FindOneUsersService,
    private readonly updateUsersService: UpdateUsersService,
    private readonly removeUsersService: RemoveUsersService,
  ) {}

  @AuditLog('CRIAR USUÁRIO')
  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUsersService.execute(createUserDto);

    return user;
  }

  @Get()
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user' })
  findOne(@Param('id') id: string) {
    return this.findOneUsersService.findOne(id);
  }

  @AuditLog('ATUALIZAR USUÁRIO')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUsersService.update(id, updateUserDto);
  }

  @AuditLog('REMOVER USUÁRIO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeUsersService.remove(id);
  }
}
