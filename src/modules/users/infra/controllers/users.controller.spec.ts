import { CreateUsersService } from '../../services/create.users.service';
import { FindAllUsersService } from '../../services/findAll.users.service';
import { FindOneUsersService } from '../../services/findOne.users.service';
import { RemoveUsersService } from '../../services/remove.users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUsersService } from '../../services/update.users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        CreateUsersService,
        FindAllUsersService,
        FindOneUsersService,
        UpdateUsersService,
        RemoveUsersService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
