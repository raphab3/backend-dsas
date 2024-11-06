import { CreateClinicalMetricService } from '../services/create.clinicalMetric.service';
import { FindAllClinicalMetricService } from '../services/findAll.clinicalMetric.service';
import { FindOneClinicalMetricService } from '../services/findOne.clinicalMetric.service';
import { RemoveClinicalMetricService } from '../services/remove.clinicalMetric.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateClinicalMetricService } from '../services/update.clinicalMetric.service';
import { ClinicalMetricController } from './clinicalMetric.controller';
import { AuditService } from '@modules/audits/services/AuditService';
import { Reflector } from '@nestjs/core';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';

describe('ClinicalMetricController', () => {
  let controller: ClinicalMetricController;
  const mockAuditInterceptor = jest.fn(() => ({
    intercept: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalMetricController],
      providers: [
        CreateClinicalMetricService,
        FindAllClinicalMetricService,
        FindOneClinicalMetricService,
        UpdateClinicalMetricService,
        RemoveClinicalMetricService,
        {
          provide: 'ClinicalMetricRepository',
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

    controller = module.get<ClinicalMetricController>(ClinicalMetricController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
