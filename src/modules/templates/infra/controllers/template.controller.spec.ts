import { CreateTemplateService } from '../../services/create.template.service';
import { FindAllTemplateService } from '../../services/findAll.template.service';
import { FindOneTemplateService } from '../../services/findOne.template.service';
import { RemoveTemplateService } from '../../services/remove.template.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTemplateService } from '../../services/update.template.service';
import { TemplateController } from './template.controller';

describe('TemplateController', () => {
  let controller: TemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        CreateTemplateService,
        FindAllTemplateService,
        FindOneTemplateService,
        UpdateTemplateService,
        RemoveTemplateService,
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
