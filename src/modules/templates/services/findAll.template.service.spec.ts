import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { FindAllTemplateService } from './findAll.template.service';

const mockTemplateRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

describe('FindAllTemplateService', () => {
  let service: FindAllTemplateService;
  let templateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllTemplateService,
        {
          provide: getRepositoryToken(Template),
          useFactory: mockTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<FindAllTemplateService>(FindAllTemplateService);
    templateRepository = module.get<Repository<Template>>(
      getRepositoryToken(Template),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(templateRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Templates and pagination', async () => {
      const result = await service.execute({ name: '', page: 1, perPage: 10 });
      const resultPaginated = {
        data: [],
        pagination: { page: 1, perPage: 10, lastPage: 0, total: 0 },
      };
      expect(result).toEqual(resultPaginated);
    });
  });
});
