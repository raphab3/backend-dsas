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
    await this.validateSpecialty(createScheduleDto.specialty_id);
    const professional = await this.validateProfessional(
      createScheduleDto.professional_id,
    );

    await this.validateSpecialtyInProfessional(
      professional,
      createScheduleDto.specialty_id,
    );

    this.validateLocation(createScheduleDto.location_id);
    this.checkIfStartTimeIsBeforeEndTime(
      createScheduleDto.start_time,
      createScheduleDto.end_time,
    );

    await this.checkForConflictingSchedules(createScheduleDto, professional.id);

    const schedule = this.prepareScheduleData(createScheduleDto, professional);
    return await this.scheduleRepository.create(schedule);
  }

  async validateSpecialty(specialtyId: string) {
    const specialtyExists = await this.specialtyRepository.findOne(specialtyId);
    if (!specialtyExists) {
      throw new HttpException('Especialidade não encontrada', 404);
    }
  }

  async validateProfessional(professionalId: string) {
    const professionalExists =
      await this.professionalRepository.findOne(professionalId);
    if (!professionalExists) {
      throw new HttpException('Profissional não encontrado', 404);
    }
    return professionalExists;
  }

  async validateSpecialtyInProfessional(
    professional: any,
    specialtyId: string,
  ) {
    const specialtyExistsInProfessional = professional.specialties.find(
      (specialty: any) => specialty.id === specialtyId,
    );
    if (!specialtyExistsInProfessional) {
      throw new HttpException(
        'Especialidade não encontrada nesse profissional',
        404,
      );
    }
  }

  validateLocation(locationId: string) {
    if (!locationId) {
      throw new HttpException('Local não informado', 400);
    }
  }

  checkIfStartTimeIsBeforeEndTime(startTime: string, endTime: string) {
    const referenceDate = '2000-01-01';
    const start = new Date(`${referenceDate}T${startTime}:00`);
    const end = new Date(`${referenceDate}T${endTime}:00`);

    if (start >= end) {
      throw new HttpException(
        'O horário de início deve ser anterior ao horário de término',
        400,
      );
    }
  }

  async checkForConflictingSchedules(
    createScheduleDto: CreateScheduleDto,
    professionalId: string,
  ) {
    const MIN_INTERVAL_MINUTES = 60;
    const requestedDate = new Date(createScheduleDto.available_date);
    const startDate = new Date(
      requestedDate.getTime() - MIN_INTERVAL_MINUTES * 60000,
    );
    const endDate = new Date(
      requestedDate.getTime() + MIN_INTERVAL_MINUTES * 60000,
    );

    const conflictingSchedules =
      await this.scheduleRepository.findConflictingSchedules(
        professionalId,
        createScheduleDto.location_id,
        startDate,
        endDate,
        createScheduleDto.start_time,
        createScheduleDto.end_time,
      );

    if (conflictingSchedules.length > 0) {
      throw new HttpException(
        'Existe(m) agenda(s) para este profissional e local em um horário muito próximo.',
        400,
      );
    }
  }

  prepareScheduleData(
    createScheduleDto: CreateScheduleDto,
    professional: any,
  ): ICreateSchedule {
    return {
      ...createScheduleDto,
      available_date: createScheduleDto.available_date.split('T')[0],
      description: `${professional.person_sig.nome}`
        .replace(/\s+/g, ' ')
        .trim(),
      professional: { id: createScheduleDto.professional_id },
      specialty: { id: createScheduleDto.specialty_id },
      location: { id: createScheduleDto.location_id },
      trainee: createScheduleDto.trainee_id
        ? { id: createScheduleDto.trainee_id }
        : null,
    };
  }
}
