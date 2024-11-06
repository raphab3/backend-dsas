import { CreateTemplateService } from '../services/create.template.service';
import { FindAllTemplateService } from '../services/findAll.template.service';
import { FindOneTemplateService } from '../services/findOne.template.service';
import { RemoveTemplateService } from '../services/remove.template.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTemplateService } from '../services/update.template.service';
import { TemplateController } from './template.controller';
import { AuditService } from '@modules/audits/services/AuditService';
import { Reflector } from '@nestjs/core';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';

describe('TemplateController', () => {
  let controller: TemplateController;
  const mockAuditInterceptor = jest.fn(() => ({
    intercept: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        CreateTemplateService,
        FindAllTemplateService,
        FindOneTemplateService,
        UpdateTemplateService,
        RemoveTemplateService,
        {
          provide: 'TemplateRepository',
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

    controller = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
