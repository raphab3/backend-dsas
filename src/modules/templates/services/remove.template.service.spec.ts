import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { RemoveTemplateService } from './remove.template.service';

const mockTemplateRepository = () => ({
  findOne: jest.fn(),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  remove: jest.fn(),
});

describe('RemoveTemplateService', () => {
  let service: RemoveTemplateService;
  let templateRepository: Repository<Template>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveTemplateService,
        {
          provide: getRepositoryToken(Template),
          useFactory: mockTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<RemoveTemplateService>(RemoveTemplateService);
    templateRepository = module.get<Repository<Template>>(
      getRepositoryToken(Template),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(templateRepository).toBeDefined();
  });

  describe('remove', () => {
    it('should successfully remove an Template', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValueOnce(new Template());
      await service.remove('1');
      expect(templateRepository.delete).toBeCalled();
    });

    it('should throw an error when Template does not exist', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      try {
        await service.remove('1');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Template não encontrado');
        expect(error.status).toBe(404);
      }
    });
  });
});
