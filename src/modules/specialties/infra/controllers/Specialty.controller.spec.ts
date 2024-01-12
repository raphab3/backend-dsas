import { CreateSpecialtieservice } from '../../services/create.Specialty.service';
import { FindAllSpecialtieservice } from '../../services/findAll.Specialty.service';
import { FindOneSpecialtieservice } from '../../services/findOne.Specialty.service';
import { RemoveSpecialtieservice } from '../../services/remove.Specialty.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateSpecialtieservice } from '../../services/update.Specialty.service';
import { SpecialtyController } from './Specialty.controller';

describe('SpecialtyController', () => {
  let controller: SpecialtyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialtyController],
      providers: [
        CreateSpecialtieservice,
        FindAllSpecialtieservice,
        FindOneSpecialtieservice,
        UpdateSpecialtieservice,
        RemoveSpecialtieservice,
      ],
    }).compile();

    controller = module.get<SpecialtyController>(SpecialtyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
