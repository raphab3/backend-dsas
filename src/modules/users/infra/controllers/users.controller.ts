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
import { Permission } from '@shared/decorators/Permission';
import { ListOfPermissionsEnum } from '@modules/permissions/interfaces/listOfPermissionsEnum';
import { AddedPermissionUserDto } from '@modules/users/dto/added-permission-user.dto';
import { AddPermissionUserService } from '@modules/users/services/addPermissionUser.service';

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
    private readonly addPermissionUserService: AddPermissionUserService,
  ) {}

  @AuditLog('CRIAR USUÁRIO')
  @Post()
  @Permission(ListOfPermissionsEnum.create_user)
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUsersService.execute(createUserDto);

    return user;
  }

  @Get()
  @Permission(ListOfPermissionsEnum.find_all_users)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user' })
  @Permission(ListOfPermissionsEnum.find_one_user)
  findOne(@Param('id') id: string) {
    return this.findOneUsersService.findOne(id);
  }

  @AuditLog('ATUALIZAR USUÁRIO')
  @Patch(':id')
  @Permission(ListOfPermissionsEnum.update_user)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUsersService.execute(id, updateUserDto);
  }

  @AuditLog('REMOVER USUÁRIO')
  @Delete(':id')
  @Permission(ListOfPermissionsEnum.remove_user)
  remove(@Param('id') id: string) {
    return this.removeUsersService.remove(id);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Add permission to user' })
  // @Permission(ListOfPermissionsEnum.add_user_permission)
  async addPermission(
    @Body() addedPermissionUserDto: AddedPermissionUserDto,
    @Param('id') id: string,
  ) {
    const user = await this.addPermissionUserService.execute({
      permission: addedPermissionUserDto.permission,
      role: addedPermissionUserDto.role,
      user_id: id,
    });

    return user;
  }
}
