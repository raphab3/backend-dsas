import PatientRepository from '../typeorm/repositories/PatientRepository';
import { Injectable } from '@nestjs/common';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class UpdatePatientService {
  constructor(private readonly patientRepository: PatientRepository) {}
  update(id: string, updatePatientDto: UpdatePatientDto) {
    if (!id) {
      throw new Error('Patient is required');
    }
    return this.patientRepository.update(id, updatePatientDto);
  }
}
