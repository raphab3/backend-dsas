import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';
import { RemovePatientRecordService } from './remove.patientRecord.service';

const mockPatientRecordRepository = () => ({
  findOne: jest.fn(),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  remove: jest.fn(),
});

describe('RemovePatientRecordService', () => {
  let service: RemovePatientRecordService;
  let patientRecordRepository: Repository<PatientRecord>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemovePatientRecordService,
        {
          provide: getRepositoryToken(PatientRecord),
          useFactory: mockPatientRecordRepository,
        },
      ],
    }).compile();

    service = module.get<RemovePatientRecordService>(
      RemovePatientRecordService,
    );
    patientRecordRepository = module.get<Repository<PatientRecord>>(
      getRepositoryToken(PatientRecord),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(patientRecordRepository).toBeDefined();
  });

  describe('remove', () => {
    it('should successfully remove an PatientRecord', async () => {
      jest
        .spyOn(patientRecordRepository, 'findOne')
        .mockResolvedValueOnce(new PatientRecord());
      await service.remove('1');
      expect(patientRecordRepository.delete).toBeCalled();
    });

    it('should throw an error when PatientRecord does not exist', async () => {
      jest
        .spyOn(patientRecordRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      try {
        await service.remove('1');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('PatientRecord não encontrado');
        expect(error.status).toBe(404);
      }
    });
  });
});
