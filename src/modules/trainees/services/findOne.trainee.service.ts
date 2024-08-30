import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainee } from '../entities/trainee.entity';

@Injectable()
export class FindOneTraineeService {
  constructor(
    @InjectRepository(Trainee)
    private readonly traineeRepository: Repository<Trainee>,
  ) {}

  async findOne(id: string): Promise<any> {
    return this.traineeRepository.findOne({
      where: { id },
    });
  }
}
