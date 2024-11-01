import { Test, TestingModule } from '@nestjs/testing';
import { CreateTemplateService } from './create.template.service';
import { Template } from '../entities/template.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CreateTemplateService', () => {
  let service: CreateTemplateService;
  let templateRepositoryMock: jest.Mock;

  beforeEach(async () => {
    const mockCreate = jest.fn().mockImplementation((dto) => ({
      id: '1',
      ...dto,
    }));

    const mockSave = jest
      .fn()
      .mockImplementation((item) => Promise.resolve(item));

    templateRepositoryMock = jest.fn(() => ({
      create: mockCreate,
      save: mockSave,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTemplateService,
        {
          provide: getRepositoryToken(Template),
          useClass: templateRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CreateTemplateService>(CreateTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new template', async () => {
    const createTemplateDto = {
      name: 'Template 1',
    };

    const template = {
      id: '2',
      ...createTemplateDto,
    };

    templateRepositoryMock().create.mockReturnValue(template);

    const result = await service.execute(createTemplateDto);

    expect(result).toEqual(template);
  });
});
