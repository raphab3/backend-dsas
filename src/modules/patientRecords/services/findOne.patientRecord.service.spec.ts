import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';
import { FindOnePatientRecordService } from './findOne.patientRecord.service';

const mockPatientRecordRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    name: 'PatientRecord 1',
  }),
});

describe('FindOnePatientRecordService', () => {
  let service: FindOnePatientRecordService;
  let patientRecordRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOnePatientRecordService,
        {
          provide: getRepositoryToken(PatientRecord),
          useFactory: mockPatientRecordRepository,
        },
      ],
    }).compile();

    service = module.get<FindOnePatientRecordService>(FindOnePatientRecordService);
    patientRecordRepository = module.get<Repository<PatientRecord>>(
      getRepositoryToken(PatientRecord),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(patientRecordRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an PatientRecord', async () => {
      const result = await service.execute('1');
      expect(result).toEqual({
        id: '1',
        name: 'PatientRecord 1',
      });
    });

    it('should return an error when PatientRecord does not exist', async () => {
      jest
        .spyOn(patientRecordRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      try {
        await service.execute('1');
      } catch (error) {
        expect(error.message).toBe('PatientRecord não encontrado');
        expect(error.status).toBe(404);
      }
    });
  });
});
