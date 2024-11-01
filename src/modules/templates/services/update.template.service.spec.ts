import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { UpdateTemplateService } from './update.template.service';

const mockTemplateRepository = () => ({
  findOne: jest.fn(),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
});

describe('UpdateTemplateService', () => {
  let service: UpdateTemplateService;
  let templateRepository: Repository<Template>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTemplateService,
        {
          provide: getRepositoryToken(Template),
          useFactory: mockTemplateRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateTemplateService>(UpdateTemplateService);
    templateRepository = module.get<Repository<Template>>(
      getRepositoryToken(Template),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(templateRepository).toBeDefined();
  });

  describe('update', () => {
    it('should successfully update an Template', async () => {
      const updateTemplateDto = { name: 'Updated Template' };
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValueOnce(new Template());
      await service.update('1', updateTemplateDto);
      expect(templateRepository.update).toHaveBeenCalledWith(
        '1',
        updateTemplateDto,
      );
    });

    it('should throw an error when Template does not exist', async () => {
      jest
        .spyOn(templateRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      try {
        await service.update('1', { name: 'Updated Template' });
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Template não encontrado');
        expect(error.status).toBe(404);
      }
    });
  });
});
