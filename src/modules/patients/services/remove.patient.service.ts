import { Injectable } from '@nestjs/common';
import PatientRepository from '../typeorm/repositories/PatientRepository';

@Injectable()
export class RemovePatientService {
  constructor(private readonly patientRepository: PatientRepository) {}
  remove(id: string) {
    return this.patientRepository.delete(id);
  }
}
