import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PersonSig } from '@modules/persosnSig/typeorm/entities/personSig.entity';
import { Location } from '@modules/locations/typeorm/entities/location.entity';

@Injectable()
export class DistributionsLocationsForAllPersonsSigService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async execute(): Promise<void> {
    try {
      const queryRunner = this.entityManager.connection.createQueryRunner();
      await queryRunner.connect();

      const locationRepo = queryRunner.manager.getRepository(Location);
      const personSigRepo = queryRunner.manager.getRepository(PersonSig);
      const locations = await locationRepo.find();

      const allPersonsSig = await personSigRepo
        .createQueryBuilder('personSig')
        .getMany();

      await Promise.all(
        allPersonsSig.map(async (personSig) => {
          await personSigRepo.save({
            ...personSig,
            locations: locations,
          });
        }),
      );
    } catch (error) {
      console.error('Error on execute seed', error);
    }
  }
}
