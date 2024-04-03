import { HttpException, Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';
import ScheduleRepository from '../typeorm/repositories/ScheduleRepository';
import ProfessionalRepository from '@modules/professionals/typeorm/repositories/ProfessionalRepository';
import { IUpdateSchedule } from '../interfaces/ISchedule';
import SpecialtyRepository from '@modules/specialties/typeorm/repositories/SpecialtyRepository';
import { format } from 'date-fns';

@Injectable()
export class UpdateScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly specialtyRepository: SpecialtyRepository,
  ) {}
  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const scheduleExists = await this.scheduleRepository.findOne(id);
    if (!scheduleExists) {
      throw new HttpException('Agenda não encontrada', 404);
    }

    await this.validateProfessional(updateScheduleDto.professional_id);
    await this.validateSpecialty(updateScheduleDto.specialty_id);
    await this.validateSpecialtyInProfessional(
      updateScheduleDto.professional_id,
      updateScheduleDto.specialty_id,
    );
    this.validateLocation(updateScheduleDto.location_id);
    this.checkIfStartTimeIsBeforeEndTime(
      updateScheduleDto.start_time,
      updateScheduleDto.end_time,
    );
    await this.checkForConflictingSchedules(
      updateScheduleDto,
      updateScheduleDto.professional_id,
    );

    const updatedSchedule = await this.prepareScheduleData(updateScheduleDto);
    return this.scheduleRepository.update(id, updatedSchedule);
  }

  async validateProfessional(professionalId: string) {
    const professionalExists =
      await this.professionalRepository.findOne(professionalId);
    if (!professionalExists) {
      throw new HttpException('Profissional não encontrado', 404);
    }
  }

  async validateSpecialty(specialtyId: string) {
    const specialtyExists = await this.specialtyRepository.findOne(specialtyId);
    if (!specialtyExists) {
      throw new HttpException('Especialidade não encontrada', 404);
    }
  }

  async validateSpecialtyInProfessional(
    professionalId: string,
    specialtyId: string,
  ) {
    const professional =
      await this.professionalRepository.findOne(professionalId);
    const specialtyExistsInProfessional = professional.specialties.find(
      (specialty) => specialty.id === specialtyId,
    );
    if (!specialtyExistsInProfessional) {
      throw new HttpException(
        'Especialidade não encontrada neste profissional',
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
    updateScheduleDto: UpdateScheduleDto,
    professionalId: string,
  ) {
    const MIN_INTERVAL_MINUTES = 60;
    const requestedDate = new Date(updateScheduleDto.available_date);
    const startDate = new Date(
      requestedDate.getTime() - MIN_INTERVAL_MINUTES * 60000,
    );
    const endDate = new Date(
      requestedDate.getTime() + MIN_INTERVAL_MINUTES * 60000,
    );

    const conflictingSchedules =
      await this.scheduleRepository.findConflictingSchedules(
        professionalId,
        updateScheduleDto.location_id,
        startDate,
        endDate,
        updateScheduleDto.start_time,
        updateScheduleDto.end_time,
      );

    if (conflictingSchedules.length > 0) {
      const conflictingTimes = conflictingSchedules
        .map(
          (schedule) =>
            `Data: ${format(schedule.available_date, 'dd/MM/yyyy')}, Horário: ${
              schedule.start_time
            } até ${schedule.end_time}`,
        )
        .join('; ');

      throw new HttpException(
        `Conflito encontrado com os seguintes agendamentos: ${conflictingTimes}. Por favor, escolha outro horário.`,
        400,
      );
    }
  }

  async prepareScheduleData(
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<IUpdateSchedule> {
    const professionalExists = await this.professionalRepository.findOne(
      updateScheduleDto.professional_id,
    );

    const description = `${professionalExists.person_sig.nome}`
      .replace(/\s+/g, ' ')
      .trim();

    return {
      available_date: updateScheduleDto.available_date.split('T')[0],
      description,
      professional: {
        id: updateScheduleDto.professional_id,
      },
      location: {
        id: updateScheduleDto.location_id,
      },
      specialty: {
        id: updateScheduleDto.specialty_id,
      },
      start_time: updateScheduleDto.start_time,
      end_time: updateScheduleDto.end_time,
      max_patients: updateScheduleDto.max_patients,
    };
  }
}
