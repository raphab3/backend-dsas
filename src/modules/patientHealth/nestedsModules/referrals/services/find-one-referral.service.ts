import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';

@Injectable()
export class FindOneReferralService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
  ) {}

  async execute(id: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id },
      relations: ['targetSpecialty', 'targetLocation', 'professional', 'patient', 'attendance'],
    });

    if (!referral) {
      throw new NotFoundException('Encaminhamento não encontrado');
    }

    return referral;
  }
}
