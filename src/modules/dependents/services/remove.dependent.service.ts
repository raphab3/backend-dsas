import { HttpException, Injectable } from '@nestjs/common';
import DependentRepository from '../typeorm/repositories/DependentRepository';

@Injectable()
export class RemoveDependentService {
  constructor(private readonly dependentRepository: DependentRepository) {}
  async remove(id: string) {
    const dependent = await this.dependentRepository.findOne(id);

    if (!dependent) {
      throw new HttpException('Dependente não encontrado', 404);
    }

    console.log('dependent: ', dependent);

    if (dependent.patients[0].appointments.length > 0) {
      throw new HttpException('Dependente possui atendimentos', 400);
    }

    return this.dependentRepository.delete(id);
  }
}
