import IPatientRepository from './IPatientRepository';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { UpdatePatientDto } from '@modules/patients/dto/update-patient.dto';
import { IPaginatedResult } from '@shared/interfaces/IPaginations';
import { paginate } from '@shared/utils/Pagination';
import { ICreatePatient } from '@modules/patients/interfaces/ICreatePatient';
import { IQueryPatients } from '@modules/patients/interfaces/IQueryPatients';

@Injectable()
class PatientRepository implements IPatientRepository {
  constructor(
    @InjectRepository(Patient)
    private ormRepository: Repository<Patient>,
  ) {}

  public async create(data: ICreatePatient): Promise<any> {
    const exists = await this.exists(data.person_sig_id, data.dependent_id);

    if (exists) {
      throw new HttpException(
        {
          message: 'Paciente já cadastrado',
        },
        409,
      );
    }

    // Procede com a criação se não existir
    const patientData: any = {
      person_sig: {
        id: data.person_sig_id,
      },
    };

    if (data.dependent_id) {
      patientData.dependent = { id: data.dependent_id };
    }

    const patient = this.ormRepository.create(patientData);
    await this.ormRepository.save(patient);
    return patient;
  }

  public async exists(
    personSigId: string,
    dependentId?: string,
  ): Promise<boolean> {
    let queryBuilder = this.ormRepository
      .createQueryBuilder('patient')
      .leftJoin('patient.person_sig', 'person_sig')
      .where('person_sig.id = :personSigId', { personSigId });

    if (dependentId) {
      queryBuilder = queryBuilder
        .leftJoin('patient.dependent', 'dependent')
        .andWhere('dependent.id = :dependentId', { dependentId });
    } else {
      queryBuilder = queryBuilder.andWhere('patient.dependent IS NULL');
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  public async list(query: IQueryPatients): Promise<IPaginatedResult<Patient>> {
    let page = 1;
    let perPage = 10;

    const patientCreateQueryBuilder = this.ormRepository
      .createQueryBuilder('patients')
      .leftJoinAndSelect('patients.person_sig', 'person_sig')
      .leftJoinAndSelect('patients.dependent', 'dependent')
      .orderBy('patients.created_at', 'DESC');

    if (query.id) {
    }

    if (query.name) {
      patientCreateQueryBuilder.where(
        `COALESCE(dependent.name, person_sig.nome) ILike :name`,
        {
          name: `%${query.name}%`,
        },
      );
    }

    if (query.matricula) {
      patientCreateQueryBuilder.where(`person_sig.matricula ILike :matricula`, {
        matricula: `%${query.matricula}%`,
      });
    }

    if (query.page) page = query.page;
    if (query.perPage) perPage = query.perPage;

    const result: IPaginatedResult<any> = await paginate(
      patientCreateQueryBuilder,
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
      .leftJoinAndSelect('patients.dependent', 'dependent')
      .where('person_sig.matricula Like :matricula', {
        matricula: `%${matricula}%`,
      })
      .getOne();
  }

  public async findPatientByPersonIdWithoutDependent(
    person_sig_id: string,
  ): Promise<Patient | undefined> {
    return await this.ormRepository
      .createQueryBuilder('patients')
      .leftJoinAndSelect('patients.person_sig', 'person_sig')
      .leftJoinAndSelect('patients.dependent', 'dependent')
      .where('person_sig.id = :person_sig_id', { person_sig_id })
      .andWhere('patients.dependent IS NULL')
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
