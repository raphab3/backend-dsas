import IProfessionalRepository from './IProfessionalRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Professional } from '../entities/professional.entity';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { UpdateProfessionalDto } from '@modules/professionals/dto/update-professional.dto';
import { ICreateProfessional } from '@modules/professionals/interfaces/IProfessional';

@Injectable()
class ProfessionalRepository implements IProfessionalRepository {
  constructor(
    @InjectRepository(Professional)
    private ormRepository: Repository<Professional>,
  ) {}

  public async create(data: ICreateProfessional): Promise<Professional> {
    const professional = this.ormRepository.create(data);
    await this.ormRepository.save(professional);
    return professional;
  }

  public async list(query: any): Promise<IPaginatedResult<any>> {
    let page = 1;
    let perPage = 10;

    const professionalsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('professionals')
      .leftJoinAndSelect('professionals.person_sig', 'person_sig')
      .leftJoinAndSelect('professionals.specialties', 'specialties')
      .orderBy('professionals.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    professionalsCreateQueryBuilder.where(where);

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
    data: UpdateProfessionalDto,
  ): Promise<Professional> {
    const builder = this.ormRepository.createQueryBuilder();
    const professional = await builder
      .update(Professional)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return professional.raw[0];
  }
}

export default ProfessionalRepository;
