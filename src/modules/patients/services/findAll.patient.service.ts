import { Injectable } from '@nestjs/common';
import PatientRepository from '../typeorm/repositories/PatientRepository';

@Injectable()
export class FindAllPatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async findAll(query: any): Promise<any> {
    return this.patientRepository.list(query);
  }
}
