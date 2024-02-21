import IPatientRepository from './IPatientRepository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { UpdatePatientDto } from '@modules/patients/dto/update-patient.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { ICreatePatient } from '@modules/patients/interfaces/ICreatePatient';

@Injectable()
class PatientRepository implements IPatientRepository {
  constructor(
    @InjectRepository(Patient)
    private ormRepository: Repository<Patient>,
  ) {}

  public async create(data: ICreatePatient): Promise<Patient> {
    const patient = this.ormRepository.create({
      ...data,
      person_sig: {
        id: data.person_sig_id,
      },
      dependent: {
        id: data.dependent_id,
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

  public async findByMatricula(
    matricula: string,
  ): Promise<Patient | undefined> {
    return await this.ormRepository
      .createQueryBuilder('patients')
      .leftJoinAndSelect('patients.person_sig', 'person_sig')
      .where('person_sig.matricula LIKE :matricula', {
        matricula: `%${matricula}%`,
      })
      .getOne();
  }

  public async findByDependentId(
    dependent_id: string,
  ): Promise<Patient | undefined> {
    return await this.ormRepository
      .createQueryBuilder('patients')
      .leftJoinAndSelect('patients.dependent', 'dependent')
      .where('dependent.id = :dependent_id', { dependent_id })
      .getOne();
  }
}

export default PatientRepository;
