import IProfessionalRepository from './IProfessionalRepository';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '../entities/professional.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import {
  ICreateProfessional,
  IUpdateProfessional,
} from '@modules/professionals/interfaces/IProfessional';

@Injectable()
class ProfessionalRepository implements IProfessionalRepository {
  constructor(
    @InjectRepository(Professional)
    private ormRepository: Repository<Professional>,
  ) {}

  public async create(data: ICreateProfessional): Promise<Professional> {
    try {
      const professional = this.ormRepository.create({
        ...data,
      });

      await this.ormRepository.save(professional);
      return professional;
    } catch (error) {
      console.log('error', error);
      throw new HttpException('Erro ao criar profissional', 500);
    }
  }

  public async list(query: any): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const professionalsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('professionals')
      .leftJoinAndSelect('professionals.person_sig', 'person_sig')
      .leftJoinAndSelect('professionals.specialties', 'specialties')
      .leftJoinAndSelect('professionals.locations', 'locations')
      .orderBy('professionals.created_at', 'DESC');

    if (query.id) {
      professionalsCreateQueryBuilder.andWhere('professionals.id = :id', {
        id: query.id,
      });
    }

    if (query.name) {
      professionalsCreateQueryBuilder.andWhere('person_sig.nome ILike :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.matricula) {
      professionalsCreateQueryBuilder.andWhere(
        'person_sig.matricula ILike :matricula',
        { matricula: `%${query.matricula}%` },
      );
    }

    if (query.specialty) {
      professionalsCreateQueryBuilder.where(
        'specialties.name ILike :specialty',
        { specialty: `%${query.specialty}%` },
      );
    }

    if (query.location_id) {
      professionalsCreateQueryBuilder.where('locations.id = :location', {
        location: query.location_id,
      });
    }

    if (query.specialty_id) {
      professionalsCreateQueryBuilder.andWhere('specialties.id = :specialty', {
        specialty: query.specialty_id,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      professionalsCreateQueryBuilder,
      {
        page,
        perPage,
      },
    );

    return result;
  }

  public async findOne(id: string): Promise<Professional | undefined> {
    return this.ormRepository.findOne({
      relations: ['specialties', 'person_sig'],
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(
    id: string,
    data: IUpdateProfessional,
  ): Promise<Professional> {
    const professional = await this.ormRepository.save(data);
    return professional;
  }
}

export default ProfessionalRepository;
