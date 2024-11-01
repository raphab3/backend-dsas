import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';
import { FindAllPatientRecordService } from './findAll.patientRecord.service';

const mockPatientRecordRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

describe('FindAllPatientRecordService', () => {
  let service: FindAllPatientRecordService;
  let patientRecordRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllPatientRecordService,
        {
          provide: getRepositoryToken(PatientRecord),
          useFactory: mockPatientRecordRepository,
        },
      ],
    }).compile();

    service = module.get<FindAllPatientRecordService>(FindAllPatientRecordService);
    patientRecordRepository = module.get<Repository<PatientRecord>>(
      getRepositoryToken(PatientRecord),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(patientRecordRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of PatientRecords and pagination', async () => {
      const result = await service.execute({ name: '', page: 1, perPage: 10 });
      const resultPaginated = {
        data: [],
        pagination: { page: 1, perPage: 10, lastPage: 0, total: 0 },
      };
      expect(result).toEqual(resultPaginated);
    });
  });
});
