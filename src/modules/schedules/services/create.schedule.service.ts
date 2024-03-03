import { HttpException, Injectable } from '@nestjs/common';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import ProfessionalRepository from '@modules/professionals/typeorm/repositories/ProfessionalRepository';
import SpecialtyRepository from '@modules/specialties/typeorm/repositories/SpecialtyRepository';
import { ICreateSchedule } from '../interfaces/ISchedule';

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
      throw new HttpException('Especialidade não encontrada', 404);
    }

    const professionalExists = await this.professionalRepository.findOne(
      createScheduleDto.professional_id,
    );

    if (!professionalExists) {
      throw new HttpException('Profissional não encontrado', 404);
    }

    const specialtyExistsInProfessional = professionalExists.specialties.find(
      (specialty) => specialty.id === createScheduleDto.specialty_id,
    );

    if (!specialtyExistsInProfessional) {
      throw new HttpException(
        'Especialidade não encontrada nesse profissional',
        404,
      );
    }

    if (!createScheduleDto.location_id) {
      throw new HttpException('Local não informado', 400);
    }

    const schedule: ICreateSchedule = {
      ...createScheduleDto,
      available_date: createScheduleDto.available_date.split('T')[0],
      description: `
        ${professionalExists.person_sig.nome}
      `
        .replace(/\s+/g, ' ')
        .trim(),
      professional: {
        id: createScheduleDto.professional_id,
      },
      specialty: {
        id: createScheduleDto.specialty_id,
      },
      location: {
        id: createScheduleDto.location_id,
      },
    };

    const saved = await this.scheduleRepository.create(schedule);

    return saved;
  }
}
