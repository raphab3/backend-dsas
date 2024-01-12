import { Injectable } from '@nestjs/common';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import PatientRepository from '../typeorm/repositories/PatientRepository';

@Injectable()
export class UpdatePatientService {
  constructor(private readonly patientRepository: PatientRepository) {}
  update(id: string, updatePatientDto: UpdatePatientDto) {
    return this.patientRepository.update(id, updatePatientDto);
  }
}
