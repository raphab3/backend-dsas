import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonSig } from '../typeorm/entities/personSig.entity';
import { Repository } from 'typeorm';

export interface IResponseEnduser {
  person_sig: {
    id: string;
    nome: string;
  };
  user: {
    id: string;
  };
  dependents: {
    id: string;
    name: string;
  }[];
}

@Injectable()
export class FindByUserIdPersonSigService {
  constructor(
    @InjectRepository(PersonSig)
    private readonly personSigRepository: Repository<PersonSig>,
  ) {}
  async execute(userId: string): Promise<IResponseEnduser> {
    const personSig = await this.personSigRepository
      .createQueryBuilder('personSig')
      .leftJoinAndSelect('personSig.user', 'user')
      .leftJoinAndSelect('personSig.dependents', 'dependents')
      .where('user.id = :userId', { userId })
      .getOne();

    console.log(personSig);

    const formattedData = {
      person_sig: {
        id: personSig.id,
        nome: personSig.nome,
      },
      user: {
        id: personSig.user.id,
      },
      dependents: personSig?.dependents?.map?.((patient) => ({
        id: patient.id,
        name: patient.name,
      })),
    };

    return formattedData;
  }
}
