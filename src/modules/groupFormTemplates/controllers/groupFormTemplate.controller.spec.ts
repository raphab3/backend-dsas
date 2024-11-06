import { CreateGroupFormTemplateService } from '../services/create.groupFormTemplate.service';
import { FindAllGroupFormTemplateService } from '../services/findAll.groupFormTemplate.service';
import { FindOneGroupFormTemplateService } from '../services/findOne.groupFormTemplate.service';
import { RemoveGroupFormTemplateService } from '../services/remove.groupFormTemplate.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateGroupFormTemplateService } from '../services/update.groupFormTemplate.service';
import { GroupFormTemplateController } from './groupFormTemplate.controller';
import { AuditService } from '@modules/audits/services/AuditService';
import { Reflector } from '@nestjs/core';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';

describe('GroupFormTemplateController', () => {
  let controller: GroupFormTemplateController;
  const mockAuditInterceptor = jest.fn(() => ({
    intercept: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupFormTemplateController],
      providers: [
        CreateGroupFormTemplateService,
        FindAllGroupFormTemplateService,
        FindOneGroupFormTemplateService,
        UpdateGroupFormTemplateService,
        RemoveGroupFormTemplateService,
        {
          provide: 'GroupFormTemplateRepository',
          useValue: {},
        },
        {
          provide: AuditService,
          useValue: {
            create: jest.fn(),
          },
        },
        { provide: Reflector, useClass: Reflector },
        { provide: AuditInterceptor, useValue: mockAuditInterceptor() },
      ],
    }).compile();

    controller = module.get<GroupFormTemplateController>(GroupFormTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
