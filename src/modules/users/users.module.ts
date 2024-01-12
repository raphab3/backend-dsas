import UsersRepository from './typeorm/repositories/UsersRepository';
import { CreateUsersService } from './services/create.users.service';
import { FindAllUsersService } from './services/findAll.users.service';
import { FindByEmailUsersService } from './services/findByEmail.users.service';
import { FindOneUsersService } from './services/findOne.users.service';
import { Module } from '@nestjs/common';
import { RemoveUsersService } from './services/remove.users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateUsersService } from './services/update.users.service';
import { User } from './typeorm/entities/user.entity';
import { UsersController } from './infra/controllers/users.controller';
import CryptoHashProvider from '@shared/providers/HashProvider/implementations/CryptoHashProvider';

const TYPE_ORM_USERS = TypeOrmModule.forFeature([User]);

@Module({
  controllers: [UsersController],
  providers: [
    UsersRepository,
    FindOneUsersService,
    CreateUsersService,
    FindAllUsersService,
    UpdateUsersService,
    RemoveUsersService,
    FindByEmailUsersService,
    CryptoHashProvider,
    {
      provide: 'UsersRepository',
      useExisting: UsersRepository,
    },
    {
      provide: 'HashProvider',
      useExisting: CryptoHashProvider,
    },
  ],
  imports: [TYPE_ORM_USERS],
  exports: [FindByEmailUsersService, FindOneUsersService, UsersRepository],
})
export class UsersModule {}
