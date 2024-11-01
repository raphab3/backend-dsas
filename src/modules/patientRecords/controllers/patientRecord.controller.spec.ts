import { CreatePatientRecordService } from '../services/create.patientRecord.service';
import { FindAllPatientRecordService } from '../services/findAll.patientRecord.service';
import { FindOnePatientRecordService } from '../services/findOne.patientRecord.service';
import { RemovePatientRecordService } from '../services/remove.patientRecord.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePatientRecordService } from '../services/update.patientRecord.service';
import { PatientRecordController } from './patientRecord.controller';
import { AuditService } from '@modules/audits/services/AuditService';
import { Reflector } from '@nestjs/core';
import AuditInterceptor from '@shared/interceptors/AuditInterceptor';

describe('PatientRecordController', () => {
  let controller: PatientRecordController;
  const mockAuditInterceptor = jest.fn(() => ({
    intercept: jest.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientRecordController],
      providers: [
        CreatePatientRecordService,
        FindAllPatientRecordService,
        FindOnePatientRecordService,
        UpdatePatientRecordService,
        RemovePatientRecordService,
        {
          provide: 'PatientRecordRepository',
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

    controller = module.get<PatientRecordController>(PatientRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
