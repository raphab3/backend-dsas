import { Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import ProfessionalRepository from '@modules/professionals/typeorm/repositories/ProfessionalRepository';
import SpecialtyRepository from '@modules/specialties/typeorm/repositories/SpecialtyRepository';

interface ICreateRequest extends CreateScheduleDto {
  description: string;
  professional: {
    id: string;
  };
  specialty: {
    id: string;
  };
}
@Injectable()
export class CreateScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly specialtyRepository: SpecialtyRepository,
  ) {}

  async execute(createScheduleDto: CreateScheduleDto) {
    const specialtyExists = await this.specialtyRepository.findOne(
      createScheduleDto.specialty_id,
    );

    if (!specialtyExists) {
      throw new Error('Specialty not found');
    }

    const professionalExists = await this.professionalRepository.findOne(
      createScheduleDto.professional_id,
    );

    if (!professionalExists) {
      throw new Error('Professional not found');
    }

    const specialtyExistsInProfessional = professionalExists.specialties.find(
      (specialty) => specialty.id === createScheduleDto.specialty_id,
    );

    if (!specialtyExistsInProfessional) {
      throw new Error('Specialty not found in professional');
    }

    const schedule: ICreateRequest = {
      ...createScheduleDto,
      available_date: createScheduleDto.available_date.split('T')[0],
      description: `
        Dr. ${professionalExists.person_sig.name} | 
        ${specialtyExistsInProfessional.name} 
      `
        .replace(/\s+/g, ' ')
        .trim(),
      professional: {
        id: createScheduleDto.professional_id,
      },
      specialty: {
        id: createScheduleDto.specialty_id,
      },
    };

    const saved = await this.scheduleRepository.create(schedule);

    return saved;
  }
}
