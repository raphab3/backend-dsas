import { Injectable } from '@nestjs/common';
import PatientRepository from '../typeorm/repositories/PatientRepository';

@Injectable()
export class FindAllPatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async findAll(): Promise<any> {
    return this.patientRepository.list();
  }
}
