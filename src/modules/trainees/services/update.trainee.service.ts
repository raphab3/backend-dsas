import { HttpException, Injectable } from '@nestjs/common';
import { UpdateTraineeDto } from '../dto/update-trainee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainee } from '../entities/trainee.entity';
import { Professional } from '@modules/professionals/typeorm/entities/professional.entity';

@Injectable()
export class UpdateTraineeService {
  constructor(
    @InjectRepository(Trainee)
    private readonly traineeRepository: Repository<Trainee>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
  ) {}

  async update(id: string, updateTraineeDto: UpdateTraineeDto): Promise<any> {
    const existTrainee = await this.traineeRepository.findOne({
      where: { id },
    });

    if (!existTrainee) {
      throw new HttpException('Estagiário não encontrado', 404);
    }

    const professional = await this.professionalRepository.findOne({
      where: { id: updateTraineeDto.supervisorId },
    });

    if (!professional) {
      throw new HttpException('Supervisor não encontrado', 404);
    }

    delete updateTraineeDto.supervisorId;

    return this.traineeRepository.update(id, {
      ...updateTraineeDto,
      supervisor: {
        id: professional.id,
      },
    });
  }
}
