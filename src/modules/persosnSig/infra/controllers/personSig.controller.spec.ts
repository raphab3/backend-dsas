import { CreatePersonSigService } from '../../services/create.personSig.service';
import { FindAllPersonSigService } from '../../services/findAll.personSig.service';
import { FindOnePersonSigService } from '../../services/findOne.personSig.service';
import { RemovePersonSigService } from '../../services/remove.personSig.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePersonSigService } from '../../services/update.personSig.service';
import { PersonSigController } from './personSig.controller';

describe('PersonSigController', () => {
  let controller: PersonSigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonSigController],
      providers: [
        CreatePersonSigService,
        FindAllPersonSigService,
        FindOnePersonSigService,
        UpdatePersonSigService,
        RemovePersonSigService,
      ],
    }).compile();

    controller = module.get<PersonSigController>(PersonSigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
