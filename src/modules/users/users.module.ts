import CryptoHashProvider from '@shared/providers/HashProvider/implementations/CryptoHashProvider';
import UsersRepository from './typeorm/repositories/UsersRepository';
import { AddPermissionUserService } from './services/addPermissionUser.service';
import { AuditModule } from '@modules/audits/Audit.module';
import { CreateUsersService } from './services/create.users.service';
import { FindAllUsersService } from './services/findAll.users.service';
import { FindByEmailUsersService } from './services/findByEmail.users.service';
import { FindOneUsersService } from './services/findOne.users.service';
import { Module } from '@nestjs/common';
import { PermissionModule } from '@modules/permissions/permission.module';
import { RemoveUsersService } from './services/remove.users.service';
import { RoleModule } from '@modules/roles/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdatePasswordUsersService } from './services/updatePassword.users.service';
import { UpdateUsersService } from './services/update.users.service';
import { User } from './typeorm/entities/user.entity';
import { UsersController } from './infra/controllers/users.controller';

const TYPE_ORM_USERS = TypeOrmModule.forFeature([User]);

@Module({
  controllers: [UsersController],
  providers: [
    UsersRepository,
    CryptoHashProvider,
    FindOneUsersService,
    CreateUsersService,
    FindAllUsersService,
    UpdateUsersService,
    RemoveUsersService,
    FindByEmailUsersService,
    AddPermissionUserService,
    UpdatePasswordUsersService,
    {
      provide: 'HashProvider',
      useExisting: CryptoHashProvider,
    },
  ],
  imports: [TYPE_ORM_USERS, AuditModule, RoleModule, PermissionModule],
  exports: [
    CreateUsersService,
    FindByEmailUsersService,
    FindOneUsersService,
    AddPermissionUserService,
    UsersRepository,
  ],
})
export class UsersModule {}
