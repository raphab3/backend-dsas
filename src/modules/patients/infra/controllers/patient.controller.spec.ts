import { CreatePatientService } from '../../services/create.patient.service';
import { FindAllPatientService } from '../../services/findAll.patient.service';
import { FindOnePatientService } from '../../services/findOne.patient.service';
import { RemovePatientService } from '../../services/remove.patient.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePatientService } from '../../services/update.patient.service';
import { PatientController } from './patient.controller';

describe('PatientController', () => {
  let controller: PatientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        CreatePatientService,
        FindAllPatientService,
        FindOnePatientService,
        UpdatePatientService,
        RemovePatientService,
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
