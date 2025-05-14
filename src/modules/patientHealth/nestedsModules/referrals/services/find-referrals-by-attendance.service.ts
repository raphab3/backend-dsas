import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity';

@Injectable()
export class FindReferralsByAttendanceService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
  ) {}

  async execute(attendanceId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { attendance: { id: attendanceId } },
      relations: ['targetSpecialty', 'targetLocation', 'professional'],
      order: { createdAt: 'DESC' },
    });
  }
}
