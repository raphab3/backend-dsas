import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VitalSigns } from '../entities/VitalSigns.entity';

@Injectable()
export class RemoveVitalSignsService {
  constructor(
    @InjectRepository(VitalSigns)
    private VitalSignsRepository: Repository<VitalSigns>,
  ) {}

  async remove(id: string): Promise<void> {
    const VitalSigns = await this.VitalSignsRepository.findOne({
      where: { id },
    });

    if (!VitalSigns) {
      throw new HttpException('VitalSigns não encontrado', 404);
    }

    await this.VitalSignsRepository.remove(VitalSigns);
  }
}
