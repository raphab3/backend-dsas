import { Injectable } from '@nestjs/common';
import PatientRepository from '../typeorm/repositories/PatientRepository';

@Injectable()
export class FindOnePatientService {
  constructor(private readonly patientRepository: PatientRepository) {}
  async findOne(id: string): Promise<any> {
    return this.patientRepository.findOne(id);
  }
}
