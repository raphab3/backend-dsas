import { CreateProfessionalService } from '../../services/create.professional.service';
import { FindAllProfessionalService } from '../../services/findAll.professional.service';
import { FindOneProfessionalService } from '../../services/findOne.professional.service';
import { RemoveProfessionalService } from '../../services/remove.professional.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProfessionalService } from '../../services/update.professional.service';
import { ProfessionalController } from './professional.controller';

describe('ProfessionalController', () => {
  let controller: ProfessionalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalController],
      providers: [
        CreateProfessionalService,
        FindAllProfessionalService,
        FindOneProfessionalService,
        UpdateProfessionalService,
        RemoveProfessionalService,
      ],
    }).compile();

    controller = module.get<ProfessionalController>(ProfessionalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
