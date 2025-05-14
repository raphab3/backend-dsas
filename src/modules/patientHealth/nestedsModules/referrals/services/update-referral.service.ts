import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';
import { UpdateReferralDto } from '../dto/update-referral.dto';
import { Specialty } from '@modules/specialties/typeorm/entities/Specialty.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';

@Injectable()
export class UpdateReferralService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async execute(
    id: string,
    updateReferralDto: UpdateReferralDto,
  ): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id },
      relations: ['targetSpecialty', 'targetLocation'],
    });

    if (!referral) {
      throw new NotFoundException('Encaminhamento não encontrado');
    }

    // Update target specialty if provided
    if (updateReferralDto.targetSpecialtyId) {
      const specialty = await this.specialtyRepository.findOne({
        where: { id: updateReferralDto.targetSpecialtyId },
      });

      if (!specialty) {
        throw new NotFoundException('Especialidade não encontrada');
      }

      referral.targetSpecialty = specialty;
    }

    // Update target location if provided
    if (updateReferralDto.targetLocationId) {
      const location = await this.locationRepository.findOne({
        where: { id: updateReferralDto.targetLocationId },
      });

      if (!location) {
        throw new NotFoundException('Local não encontrado');
      }

      referral.targetLocation = location;
    } else if (updateReferralDto.targetLocationId === null) {
      referral.targetLocation = null;
    }

    // Update other fields if provided
    if (updateReferralDto.reason !== undefined) {
      referral.reason = updateReferralDto.reason;
    }

    if (updateReferralDto.clinicalObservations !== undefined) {
      referral.clinicalObservations = updateReferralDto.clinicalObservations;
    }

    if (updateReferralDto.priority !== undefined) {
      referral.priority = updateReferralDto.priority;
    }

    if (updateReferralDto.status !== undefined) {
      referral.status = updateReferralDto.status;

      // If status is changed to COMPLETED, set completedDate
      if (updateReferralDto.status === 'COMPLETED' && !referral.completedDate) {
        referral.completedDate = new Date();
      }
    }

    if (updateReferralDto.completedDate !== undefined) {
      referral.completedDate = updateReferralDto.completedDate
        ? new Date(updateReferralDto.completedDate)
        : null;
    }

    return this.referralRepository.save(referral);
  }
}
