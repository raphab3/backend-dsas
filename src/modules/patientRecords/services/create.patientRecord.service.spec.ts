import { Test, TestingModule } from '@nestjs/testing';
import { CreatePatientRecordService } from './create.patientRecord.service';
import { PatientRecord } from '../entities/patientRecord.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CreatePatientRecordService', () => {
  let service: CreatePatientRecordService;
  let patientRecordRepositoryMock: jest.Mock;

  beforeEach(async () => {
    const mockCreate = jest.fn().mockImplementation((dto) => ({
      id: '1',
      ...dto,
    }));

    const mockSave = jest
      .fn()
      .mockImplementation((item) => Promise.resolve(item));

    patientRecordRepositoryMock = jest.fn(() => ({
      create: mockCreate,
      save: mockSave,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePatientRecordService,
        {
          provide: getRepositoryToken(PatientRecord),
          useClass: patientRecordRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CreatePatientRecordService>(CreatePatientRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new patientRecord', async () => {
    const createPatientRecordDto = {
      name: 'PatientRecord 1',
    };

    const patientRecord = {
      id: '2',
      ...createPatientRecordDto,
    };

    patientRecordRepositoryMock().create.mockReturnValue(patientRecord);

    const result = await service.execute(createPatientRecordDto);

    expect(result).toEqual(patientRecord);
  });
});
