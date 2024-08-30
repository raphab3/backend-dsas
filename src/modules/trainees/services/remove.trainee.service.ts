import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainee } from '../entities/trainee.entity';

@Injectable()
export class RemoveTraineeService {
  constructor(
    @InjectRepository(Trainee)
    private readonly traineeRepository: Repository<Trainee>,
  ) {}

  remove(id: string) {
    return this.traineeRepository.delete(id);
  }
}
