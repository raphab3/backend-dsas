import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { FindOneTemplateService } from './findOne.template.service';

const mockTemplateRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Template 1',
  }),
});

describe('FindOneTemplateService', () => {
  let service: FindOneTemplateService;
  let templateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneTemplateService,
        {
          provide: getRepositoryToken(Template),
          useFactory: mockTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<FindOneTemplateService>(FindOneTemplateService);
    templateRepository = module.get<Repository<Template>>(
      getRepositoryToken(Template),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(templateRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an Template', async () => {
      const result = await service.execute('1');
      expect(result).toEqual({
        id: '1',
        name: 'Template 1',
      });
    });

    it('should return an error when Template does not exist', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      try {
        await service.execute('1');
      } catch (error) {
        expect(error.message).toBe('Template não encontrado');
        expect(error.status).toBe(404);
      }
    });
  });
});
