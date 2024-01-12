import { Injectable } from '@nestjs/common';
import PatientRepository from '../typeorm/repositories/PatientRepository';

@Injectable()
export class CreatePatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(createPatientDto: any) {
    const saved = await this.patientRepository.create(createPatientDto);
    console.log('CreatePatientService -> saved', saved);
  }
}
