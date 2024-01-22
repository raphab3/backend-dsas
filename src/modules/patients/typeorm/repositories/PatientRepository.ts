import IPatientRepository from './IPatientRepository';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { UpdatePatientDto } from '@modules/patients/dto/update-patient.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';

@Injectable()
class PatientRepository implements IPatientRepository {
  constructor(
    @InjectRepository(Patient)
    private ormRepository: Repository<Patient>,
  ) {}

  public async create(data: CreatePatientDto): Promise<Patient> {
    const patient = this.ormRepository.create({
      ...data,
      person_sig: {
        id: data.person_sig_id,
      },
    });
    await this.ormRepository.save(patient);
    return patient;
  }

  public async list(query: any): Promise<IPaginatedResult<Patient>> {
    let page = 1;
    let perPage = 10;

    const professionalsCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('patients')
      .leftJoinAndSelect('patients.person_sig', 'person_sig')
      .orderBy('patients.created_at', 'DESC');

    const where: Partial<any> = {};

    if (query.id) {
      where.id = query.id;
    }

    if (query.name) {
      where.person_sig = {
        name: ILike(`%${query.name}%`),
      };
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

  public async findOne(id: string): Promise<Patient | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: string, data: UpdatePatientDto): Promise<Patient> {
    const builder = this.ormRepository.createQueryBuilder();
    const patient = await builder
      .update(Patient)
      .set({
        ...data,
        person_sig: {
          id: data.person_sig_id,
        },
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return patient.raw[0];
  }
}

export default PatientRepository;