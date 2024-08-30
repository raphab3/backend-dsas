import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Trainee } from '../entities/trainee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';

@Injectable()
export class CreateTraineeService {
  constructor(
    @InjectRepository(Trainee)
    private readonly traineeRepository: Repository<Trainee>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
  ) {}

  async execute(createTraineeDto: any) {
    const professional = await this.professionalRepository.findOne({
      where: { id: createTraineeDto.supervisorId },
    });

    if (!professional) {
      throw new HttpException('Supervisor não encontrado', 404);
    }

    const newTrainne = this.traineeRepository.create({
      ...createTraineeDto,
      supervisor: {
        id: professional.id,
      },
    });
    await this.traineeRepository.save(newTrainne);
  }
}
