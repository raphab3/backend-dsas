import IPatientRepository from './IPatientRepository';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Injectable()
class PatientRepository implements IPatientRepository {
  constructor(
    @InjectRepository(Patient)
    private ormRepository: Repository<Patient>,
  ) {}

  public async create(data: CreatePatientDto): Promise<Patient> {
    const patient = this.ormRepository.create(data);
    await this.ormRepository.save(patient);
    return patient;
  }

  public async list(): Promise<Patient[]> {
    return this.ormRepository.find();
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

  public async update(id: string, data: CreatePatientDto): Promise<Patient> {
    const builder = this.ormRepository.createQueryBuilder();
    const patient = await builder
      .update(Patient)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();
    return patient.raw[0];
  }
}

export default PatientRepository;
