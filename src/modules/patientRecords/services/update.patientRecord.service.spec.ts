import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from '../entities/patientRecord.entity';
import { UpdatePatientRecordService } from './update.patientRecord.service';

const mockPatientRecordRepository = () => ({
  findOne: jest.fn(),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
});

describe('UpdatePatientRecordService', () => {
  let service: UpdatePatientRecordService;
  let patientRecordRepository: Repository<PatientRecord>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePatientRecordService,
        {
          provide: getRepositoryToken(PatientRecord),
          useFactory: mockPatientRecordRepository,
        },
      ],
    }).compile();

    service = module.get<UpdatePatientRecordService>(UpdatePatientRecordService);
    patientRecordRepository = module.get<Repository<PatientRecord>>(
      getRepositoryToken(PatientRecord),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(patientRecordRepository).toBeDefined();
  });

  describe('update', () => {
    it('should successfully update an PatientRecord', async () => {
      const updatePatientRecordDto = { name: 'Updated PatientRecord' };
      jest
        .spyOn(patientRecordRepository, 'findOne')
        .mockResolvedValueOnce(new PatientRecord());
      await service.update('1', updatePatientRecordDto);
      expect(patientRecordRepository.update).toHaveBeenCalledWith(
        '1',
        updatePatientRecordDto,
      );
    });

    it('should throw an error when PatientRecord does not exist', async () => {
      jest
        .spyOn(patientRecordRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      try {
        await service.update('1', { name: 'Updated PatientRecord' });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('PatientRecord não encontrado');
        expect(error.status).toBe(404);
      }
    });
  });
});
