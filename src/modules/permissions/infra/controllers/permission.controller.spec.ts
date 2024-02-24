import { CreatePermissionService } from '../../services/create.permission.service';
import { FindAllPermissionService } from '../../services/findAll.permission.service';
import { FindOnePermissionService } from '../../services/findOne.permission.service';
import { RemovePermissionService } from '../../services/remove.permission.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePermissionService } from '../../services/update.permission.service';
import { PermissionController } from './permission.controller';

describe('PermissionController', () => {
  let controller: PermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        CreatePermissionService,
        FindAllPermissionService,
        FindOnePermissionService,
        UpdatePermissionService,
        RemovePermissionService,
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
