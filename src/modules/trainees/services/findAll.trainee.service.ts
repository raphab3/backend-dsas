import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainee } from '../entities/trainee.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { QueryTraineeDto } from '../dto/query-trainee.dto';

@Injectable()
export class FindAllTraineeService {
  constructor(
    @InjectRepository(Trainee)
    private readonly traineeRepository: Repository<Trainee>,
  ) {}

  async findAll(query: QueryTraineeDto): Promise<any> {
    return this.list(query);
  }

  private async list(query: QueryTraineeDto): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const specialtyCreateQueryBuilder = this.traineeRepository
      .createQueryBuilder('trainee')
      .leftJoinAndSelect('trainee.supervisor', 'supervisor')
      .leftJoinAndSelect('supervisor.person_sig', 'person_sig')
      .orderBy('trainee.name', 'ASC');

    if (query.name) {
      const name = query.name.toLowerCase();
      specialtyCreateQueryBuilder.where('LOWER(trainee.name) ILike :name', {
        name: `%${name}%`,
      });
    }

    if (query.cpf) {
      specialtyCreateQueryBuilder.where('trainee.cpf ILike:cpf', {
        cpf: `%${query.cpf}%`,
      });
    }

    if (query.matricula) {
      specialtyCreateQueryBuilder.where(
        'person_sig.matricula ILike :matricula',
        {
          matricula: `%${query.matricula}%`,
        },
      );
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      specialtyCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    const data = result.data.map((trainee) => {
      const { supervisor, ...rest } = trainee;
      return {
        ...rest,
        supervisor: {
          id: supervisor.id,
          name: supervisor?.person_sig?.nome,
          matricula: supervisor?.person_sig?.matricula,
        },
      };
    });

    return {
      ...result,
      data,
    };
  }
}
