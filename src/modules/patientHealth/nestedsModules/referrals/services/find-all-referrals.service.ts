import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';

@Injectable()
export class FindAllReferralsService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
  ) {}

  async execute(): Promise<Referral[]> {
    return this.referralRepository.find({
      relations: ['targetSpecialty', 'targetLocation', 'professional', 'patient', 'attendance'],
      order: { createdAt: 'DESC' },
    });
  }
}
