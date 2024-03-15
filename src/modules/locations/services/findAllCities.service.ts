import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { City } from '../typeorm/entities/city.entity';

type IRequest = {
  uf?: string;
};

@Injectable()
export class FindAllCitieService {
  constructor(@InjectEntityManager() private entityManager) {}

  async execute({ uf }: IRequest): Promise<any> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();

    const cityRepo = queryRunner.manager.getRepository(City);

    const cities = await cityRepo.find({
      where: {
        uf,
      },
    });

    await queryRunner.release();

    return cities;
  }
}
