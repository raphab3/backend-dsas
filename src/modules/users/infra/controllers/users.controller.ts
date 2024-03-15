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
  UseFilters,
} from '@nestjs/common';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';
import { AuditLog } from '@modules/audits/decorators';
import { Permission } from '@shared/decorators/Permission';
import { PermissionsEnum } from '@modules/permissions/interfaces/permissionsEnum';
import { AddedPermissionUserDto } from '@modules/users/dto/added-permission-user.dto';
import { AddPermissionUserService } from '@modules/users/services/addPermissionUser.service';
import { EntityExceptionFilter } from '@shared/interceptors/EntityPropertyNotFoundError';
import { UpdatePasswordUsersService } from '@modules/users/services/updatePassword.users.service';
import { UpdatePasswordUser } from '@modules/users/dto/updatePasswordUser.dto';

@Catch(HttpException)
@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT')
@UseInterceptors(AuditInterceptor)
@UseFilters(new EntityExceptionFilter())
export class UsersController {
  constructor(
    private readonly createUsersService: CreateUsersService,
    private readonly findAllUsersService: FindAllUsersService,
    private readonly findOneUsersService: FindOneUsersService,
    private readonly updateUsersService: UpdateUsersService,
    private readonly removeUsersService: RemoveUsersService,
    private readonly addPermissionUserService: AddPermissionUserService,
    private readonly updatePasswordUsersService: UpdatePasswordUsersService,
  ) {}

  @AuditLog('CRIAR USUÁRIO')
  @Post()
  @Permission(PermissionsEnum.create_user)
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUsersService.execute(createUserDto);

    return user;
  }

  @Get()
  @Permission(PermissionsEnum.find_all_users)
  findAll(@Req() req: any) {
    const query = req.query;
    return this.findAllUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user' })
  @Permission(PermissionsEnum.find_one_user)
  findOne(@Param('id') id: string) {
    return this.findOneUsersService.findOne(id);
  }

  @AuditLog('ATUALIZAR USUÁRIO')
  @Patch(':id')
  @Permission(PermissionsEnum.update_user)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUsersService.execute(id, updateUserDto);
  }

  @AuditLog('UPDATE MY PASSWORD USUÁRIO')
  @Patch(':id/password')
  @ApiOperation({ summary: 'Update my password' })
  updatePassword(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateUserDto: UpdatePasswordUser,
  ) {
    const userIdByRequest = req.user.userId;
    if (userIdByRequest !== id) {
      throw new HttpException(
        'Usuário não pode alterar senha de outro usuário',
        400,
      );
    }

    return this.updatePasswordUsersService.execute(id, updateUserDto);
  }

  @AuditLog('REMOVER USUÁRIO')
  @Delete(':id')
  @Permission(PermissionsEnum.remove_user)
  remove(@Param('id') id: string) {
    return this.removeUsersService.remove(id);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Add permission to user' })
  // @Permission(PermissionsEnum.add_user_permission)
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
