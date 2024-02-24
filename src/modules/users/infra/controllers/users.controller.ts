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
  UseInterceptors,
} from '@nestjs/common';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@modules/permissions/decorators';

@Catch(HttpException)
@ApiTags('users')
@Controller('users')
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
  @Permission('find_all_users')
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user' })
  @Permission('find_one_user')
  findOne(@Param('id') id: string) {
    return this.findOneUsersService.findOne(id);
  }

  @AuditLog('ATUALIZAR USUÁRIO')
  @Patch(':id')
  @Permission('update_user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUsersService.execute(id, updateUserDto);
  }

  @AuditLog('REMOVER USUÁRIO')
  @Delete(':id')
  @Permission('remove_user')
  remove(@Param('id') id: string) {
    return this.removeUsersService.remove(id);
  }
}
