import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';
import { CreateReferralDto } from '../dto/create-referral.dto';
import { Patient } from '@modules/patients/typeorm/entities/patient.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';
import { Attendance } from '@modules/attendances/entities/attendance.entity';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';

@Injectable()
export class CreateReferralService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private professionalRepository: Repository<Professional>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async execute(createReferralDto: CreateReferralDto): Promise<Referral> {
    // Verificar se o paciente existe
    const patient = await this.patientRepository.findOne({
      where: { id: createReferralDto.patientId },
    });
    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Verificar se o profissional existe
    const professional = await this.professionalRepository.findOne({
      where: { id: createReferralDto.professionalId },
    });
    if (!professional) {
      throw new NotFoundException('Profissional não encontrado');
    }

    // Verificar se o atendimento existe
    const attendance = await this.attendanceRepository.findOne({
      where: { id: createReferralDto.attendanceId },
    });
    if (!attendance) {
      throw new NotFoundException('Atendimento não encontrado');
    }

    // Verificar se a especialidade de destino existe
    const targetSpecialty = await this.specialtyRepository.findOne({
      where: { id: createReferralDto.targetSpecialtyId },
    });
    if (!targetSpecialty) {
      throw new NotFoundException('Especialidade de destino não encontrada');
    }

    // Verificar se o local de destino existe (se fornecido)
    let targetLocation = null;
    if (createReferralDto.targetLocationId) {
      targetLocation = await this.locationRepository.findOne({
        where: { id: createReferralDto.targetLocationId },
      });
      if (!targetLocation) {
        throw new NotFoundException('Local de destino não encontrado');
      }
    }

    // Criar e salvar o encaminhamento
    const referral = this.referralRepository.create({
      patient,
      professional,
      attendance,
      targetSpecialty,
      targetLocation,
      reason: createReferralDto.reason,
      clinicalObservations: createReferralDto.clinicalObservations,
      priority: createReferralDto.priority,
    });

    return this.referralRepository.save(referral);
  }
}
