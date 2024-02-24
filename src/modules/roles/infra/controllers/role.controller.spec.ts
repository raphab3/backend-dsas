import { CreateRoleService } from '../../services/create.role.service';
import { FindAllRoleService } from '../../services/findAll.role.service';
import { FindOneRoleService } from '../../services/findOne.role.service';
import { RemoveRoleService } from '../../services/remove.role.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRoleService } from '../../services/update.role.service';
import { RoleController } from './role.controller';

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        CreateRoleService,
        FindAllRoleService,
        FindOneRoleService,
        UpdateRoleService,
        RemoveRoleService,
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
