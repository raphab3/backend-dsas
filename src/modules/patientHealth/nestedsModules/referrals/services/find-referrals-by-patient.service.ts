import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';

@Injectable()
export class FindReferralsByPatientService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
  ) {}

  async execute(patientId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { patient: { id: patientId } },
      relations: [
        'targetSpecialty',
        'targetLocation',
        'professional',
        'attendance',
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
