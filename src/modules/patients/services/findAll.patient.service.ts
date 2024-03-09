import { Injectable } from '@nestjs/common';
import PatientRepository from '../typeorm/repositories/PatientRepository';
import { IQueryPatients } from '../interfaces/IQueryPatients';

@Injectable()
export class FindAllPatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async findAll(query: IQueryPatients): Promise<any> {
    return this.patientRepository.list(query);
  }
}
